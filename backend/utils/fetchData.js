/*
Student ID | Name
-----------------------
1155127438 | HONG Kai Yin 
1155141990 | NG Wing Ki Vickie
1155142639 | LAM Yan Yu
1155127411 | WONG Sai Ho
1155127379 | Tang Siu Cheong
1155133623 | Ho Lee Lee
*/

const { XMLParser } = require('fast-xml-parser');
const moment = require('moment');
const fetch = require('node-fetch');
const Location = require('../models/locations.model');
const Pollution = require('../models/pollutions.model');
const { pollution_info_url } = require('../config.json');

let lastBuildDate = null;

const fetchPollutionInfo = async (forceRefresh=false)=>{
    const res = await fetch(pollution_info_url);
    const xml = await res.text();
    const xmlParser = new XMLParser();
    const json = xmlParser.parse(xml);

    const currentBuildDate = moment(json.AQHI24HrPollutantConcentration.lastBuildDate).toString();

    if (forceRefresh || lastBuildDate != currentBuildDate){
        // Only update pollution info when the last build date is updated
        lastBuildDate = currentBuildDate;
        
        const pollutionInfo = json.AQHI24HrPollutantConcentration.PollutantConcentration;
        for (let i=0; i<pollutionInfo.length; i++){
            const fullname = pollutionInfo[i].StationName + " Air Quality Monitoring Station";
            const datetime = moment(pollutionInfo[i].DateTime).toDate();
            
            const location = await Location.findOne({ "name": fullname }).exec();
            if (location != null) {
                const isEntryExist = await Pollution.exists({ "location": location._id, "datetime": datetime }).exec();
                if (isEntryExist == null){
                    const newEntry = await Pollution.create({
                        "location": location._id,
                        "datetime": datetime,
                        "no2": (typeof pollutionInfo[i]['NO2'] == 'number'?pollutionInfo[i]['NO2']:null),
                        "o3": (typeof pollutionInfo[i]['O3'] == 'number'?pollutionInfo[i]['O3']:null),
                        "so2": (typeof pollutionInfo[i]['SO2'] == 'number'?pollutionInfo[i]['SO2']:null),
                        "co": (typeof pollutionInfo[i]['CO'] == 'number'?pollutionInfo[i]['CO']:null),
                        "pm10": (typeof pollutionInfo[i]['PM10'] == 'number'?pollutionInfo[i]['PM10']:null),
                        "pm2_5": (typeof pollutionInfo[i]['PM2.5'] == 'number'?pollutionInfo[i]['PM2.5']:null)
                    });
                    const updateResult = await Location.updateOne(
                        {_id: location._id},
                        { $push: { pollutions: newEntry._id } }
                    ).exec();
                }
            }
        }
    
    } 
};

module.exports = fetchPollutionInfo;