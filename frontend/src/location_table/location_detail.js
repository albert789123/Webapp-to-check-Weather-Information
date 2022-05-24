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

import React, { useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, InfoBox, useLoadScript } from "@react-google-maps/api";
import { Container, Spinner, Row, Col, FloatingLabel, Form, Button, CloseButton } from 'react-bootstrap';
import LocationMarker from '../maps/locationMarker';
import { Chart as ChartJS } from 'chart.js/auto';
import { Chart, Line } from 'react-chartjs-2';
import "../App.css"
import { useParams, useNavigate } from "react-router-dom";

function LocationItem() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBlAfRLhVvB-wiCi7gcqfOZ5r29SlQ8NBc"
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const commentInputRef = useRef();
    const emotionInputRef = useRef();
    const [locationDetails, setLocationDetails] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentInputText, setCommentInputText] = useState("");
    const [emotionInputText, setEmotionInputText] = useState("");
    const [infoPanelWidth, setInfoPanelWidth] = useState(400);
    const [isInfoPanelOpened, setIsInfoPanelOpened] = useState(true);
    const [isCommentsLoading, setIsCommentLoading] = useState(true);
    const [isLocationLoading, setIsLocationLoading] = useState(true);
    const [googleMap, setGoogleMap] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(11);
    const pollutionDataLists = useMemo(()=>{
        let dataMap = {
            "labels": [],
            "no2": [],
            "o3": [],
            "so2": [],
            "co": [],
            "pm10": [],
            "pm2_5": []
        };
        if (locationDetails !== null){
            for (let idx = locationDetails.pollutions.length-1; idx>=0; idx--){
                const pollutions = locationDetails.pollutions[idx];
                const localDatetime = new Date(pollutions.datetime);
                dataMap.labels.push(localDatetime.toLocaleString());
                for (let key in pollutions){
                    //console.log(key, pollutions[key]);
                    if (key in dataMap) dataMap[key].push((pollutions[key] === null ? 0 : pollutions[key]));
                }
            }
        }
        console.log(dataMap);
        return dataMap;
    }, [locationDetails]);
    const RANDOM_COLORS = useMemo(()=>{
        let randomColors = [];
        for (let i=0; i<100; i++){
            let color = Math.floor(Math.random()*16777215).toString(16);
            if (color.toLowerCase() == "ffffff") color = Math.floor(Math.random()*16777215).toString(16);
            randomColors.push(color);
        }
        return randomColors;
    }, []);
    const MARKER_CENTER = useMemo(()=>{
       if (locationDetails === null) return {lat: 22.3379456, lng: 114.1571584};
       else return {lat: locationDetails.lat, lng: locationDetails.long}; 
    }, [locationDetails]);
    const MAP_STYLE = useMemo(
        ()=>({
            width: "100%",
            height: "calc(100vh - 56px)"
        }),
        []
    );

    const onMapLoaded = (map)=>{
        setGoogleMap(map);
    }

    const onMapZoomChanged = ()=>{
        if (googleMap) setZoomLevel(googleMap.getZoom());
    }

    const onScreenResize = ()=>{
        if (window.innerWidth < 400) setInfoPanelWidth(window.innerWidth);
        else setInfoPanelWidth(400);
    }

    const fetchLocationDetails = async ()=>{
        setIsLocationLoading(true);
        try{
            const res = await fetch(`${window.backendUrl}/locations/${id}`);
            if (res.status !== 200) throw new Error(await res.text());
            const location = await res.json();
            setLocationDetails(location);
        }catch(error){
            console.error(error.message);
            alert(error.message);
            setLocationDetails(null);
        }
        setIsLocationLoading(false);
    }

    const fetchComments = async ()=>{
        setIsCommentLoading(true);
        try{
            const res = await fetch(`${window.backendUrl}/locations/${id}/comments`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (res.status !== 200) throw new Error(await res.text());
            const comments = await res.json();
            console.log(comments);
            setComments(comments);
        }catch(error){
            console.error(error.message);
            setComments([]);
        }
        setIsCommentLoading(false);
    }

    const postComment = async (e)=>{
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false || commentInputText == "" || emotionInputText == "") {
            console.error("Comment Form Error!");
            alert("Invalid comment or emotion!");
            return;
        }

        setIsCommentLoading(true);
        try{
            const user = sessionStorage.getItem("userInfo");
            if (user == null) throw new Error("User Not Logged In!");

            const res = await fetch(`${window.backendUrl}/locations/${id}/comments`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JSON.parse(user).token}`
                },
                body: JSON.stringify({
                    "comment": commentInputText,
                    "emotion": emotionInputText
                })
            });
            if (res.status !== 201) throw new Error(await res.text());
            setIsCommentLoading(false);
            if (commentInputRef){
                commentInputRef.current.value = "";
                setCommentInputText("");
            }
            if (emotionInputRef){
                emotionInputRef.current.value = "";
                setEmotionInputText("");
            }
            fetchComments();
        }catch(error){
            console.error(error.message);
            alert(error.message);
        }
    }

    useEffect(()=>{
        fetchLocationDetails();
        fetchComments();
        window.addEventListener('resize', onScreenResize);

        return ()=>{
            window.removeEventListener('resize', onScreenResize);
        }
    }, []);


    return (
    <Container fluid style={{padding: "0", position: "fixed", left: "0", top: "56px"}}>
        {!(isLoaded && !isLocationLoading) && 
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", bottom: "0", left: "0", width: "100%", height: "calc(100vh - 56px)", zIndex: "100", backgroundColor: "rgba(0,0,0,0.8)"}}>
                <Spinner animation="border" style={{color: "white"}}/>
            </div>
        }
        {isLoaded &&
            <GoogleMap onLoad={onMapLoaded} onZoomChanged={onMapZoomChanged} clickableIcons={false} zoom={15} center={MARKER_CENTER} mapContainerStyle={MAP_STYLE}>
                {locationDetails !== null && 
                <>
                    <LocationMarker id={locationDetails._id} position={{lat: locationDetails.lat, lng: locationDetails.long}} name={locationDetails.name} address={locationDetails.address} disablePopup={true}></LocationMarker>
                    <InfoBox position={{lat: locationDetails.lat, lng: locationDetails.long}} options={{closeBoxURL: ''}} >
                        <p style={{paddingLeft: "2rem", fontSize: "1rem", color: "red", WebkitTextStroke: "0.5px #8F0000"}}>{locationDetails.name}</p>
                    </InfoBox>
                </>
                }
            </GoogleMap>
        }

        <Button onClick={()=>setIsInfoPanelOpened(!isInfoPanelOpened)} id="toggle-btn" style={{position: "fixed", left: `${infoPanelWidth}px`, top: "50vh", height: "3rem", backgroundColor: "white", border: "none", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", borderTopLeftRadius: "0", borderBottomLeftRadius: "0", animation: (isInfoPanelOpened ? "slideInFromLeft 0.5s ease-in-out 0s 1 forwards" : "slideOutToLeft 0.5s ease-in-out 0s 1 forwards")}}>
            <div style={{display: "block", width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderRight: (isInfoPanelOpened ? "10px solid black" : "none"), borderLeft: (isInfoPanelOpened ? "none" : "10px solid black")}}></div>
        </Button>

        <div id="info-panel" style={{position: "fixed", left: "0", top: "56px", width: `${infoPanelWidth}px`, height: "calc(100vh - 56px)", backgroundColor: "white", padding: "1rem", textAlign: "start", overflowY: "auto", animation: (isInfoPanelOpened ? "slideInFromLeft 0.5s ease-in-out 0s 1 forwards" : "slideOutToLeft 0.5s ease-in-out 0s 1 forwards")}}>
            {//(isLocationLoading && locationDetails === null) && <Spinner animation="border" style={{color: "rgb(63, 81, 181)"}}/>
            }
            {locationDetails !== null && 
            <>
                <Button variant="muted" size="sm" onClick={()=>navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#6573c3" className="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg>
                </Button><br/><br/>
                <div style={{position: "relative"}}>
                    {infoPanelWidth < 400 && <CloseButton style={{position: "absolute", right: "10px", top: "10px"}} onClick={()=>setIsInfoPanelOpened(false)}/>}
                    <h4 style={{paddingRight: (infoPanelWidth < 400 ? "calc(1rem + 20px)" : "0"), color: "#2c387e"}}>{locationDetails.name}</h4>
                    <p style={{fontSize: "0.8rem", color: "#424242"}}>{locationDetails.address}</p>
                    <p style={{fontSize: "0.8rem", color: "#424242"}}>{locationDetails.lat}, {locationDetails.long}</p>
                </div>

            <hr style={{borderTop: "3px solid #bbb"}}/>
            <h5 style={{fontWeight: "600", textDecoration: "underline", color: "#2c387e"}}>Past 24 Hours Pollution Data</h5>

            {pollutionDataLists.labels.length > 0 &&
                Object.keys(pollutionDataLists).filter(key=>key!=="labels").map((key, idx)=>{
                    const uppercasedKey = key.toUpperCase().replace("_", ".");

                    return(
                    <Line key={`chart-${uppercasedKey}`} options={{
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: uppercasedKey
                            }
                        },
                        scales: {
                            x: {
                                ticks: {
                                    display: false
                                }
                            }
                        }
                    }} data={{
                        labels: pollutionDataLists.labels,
                        datasets: [{
                            label: uppercasedKey,
                            data: pollutionDataLists[key],
                            fill: false,
                            borderColor: "brown",
                            tension: 0.1
                        }]
                    }}/>
                    );
                })
            }

            {pollutionDataLists.labels.length > 0 && <hr style={{borderTop: "3px solid #bbb"}}/>}

            <h5 style={{fontWeight: "600", textDecoration: "underline", color: "#2c387e"}}>Comments</h5>
            <br/>
            {!isCommentsLoading && comments.map((comment, idx)=>{
                const commentDatetime = new Date(comment.createdAt);
                const hourString = (commentDatetime.getHours() < 10 ? `0${commentDatetime.getHours()}` : `${commentDatetime.getHours()}`);
                const minuteString = (commentDatetime.getMinutes() < 10 ? `0${commentDatetime.getMinutes()}` : `${commentDatetime.getMinutes()}`);

                return (
                    <Container key={comment._id}>
                        <Row>
                            <Col xs={2}>
                                <p style={{width: "3rem", height: "3rem", borderRadius: "50%", backgroundColor: `#${(RANDOM_COLORS[idx] ? RANDOM_COLORS[idx] : "000000")}`, textAlign: "center", paddingTop: "0.75rem", fontWeight: "bold", color: "white"}}>
                                    {comment.user.name.substring(0, 2)}
                                </p>
                            </Col>
                            <Col xs={10}>
                                <h6 style={{textDecoration: "underline", color: "#2c387e"}}>{comment.user.name} feeling {comment.emotion}</h6>
                                <p style={{fontStyle: "italic"}}>{comment.comment}</p>
                                <p style={{textAlign: "end", fontSize: "0.5rem"}}>{`${commentDatetime.toLocaleDateString()} ${hourString}:${minuteString}`}</p>
                            </Col>
                        </Row>
                    </Container>
                );
            })
            }
            {!isCommentsLoading && comments.length <= 0 && <p style={{fontStyle: "italic"}}>No comments for this location</p>}

            <hr style={{borderTop: "3px solid #bbb"}}/>

            <Form style={{display: "flex", flexDirection: "column", justifyContent: "center", rowGap: "0.5rem"}} onSubmit={postComment}>
                <h5 style={{fontWeight: "600", textDecoration: "underline", color: "#2c387e"}}>Leave Your Comment</h5>
                <Form.Group controlId="commentInput">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control ref={commentInputRef} type="text" minLength={1} placeholder="This location seems interesting..." onChange={(e)=>setCommentInputText(e.target.value)}required/>
                </Form.Group>
                <Form.Group controlId="emotionInput" >
                    <Form.Label>Emotion</Form.Label>
                    <Form.Control ref={emotionInputRef} type="text" minLength={1} placeholder="What's your feel about this place?" onChange={(e)=>setEmotionInputText(e.target.value)} required/>
                </Form.Group>
                <style type="text/css">
                    {`
                    .btn-indigo {
                    background-color: #6573c3;
                    color: white;
                    }
                    `}
                </style>
                <Button variant="indigo" type="submit">Submit</Button>
            </Form>
            </>
        }
        </div>
    </Container>
    
    );
}

export default LocationItem;