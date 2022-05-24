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

const { gql } = require('apollo-server-express');
const { GraphQLScalarType, Kind } = require('graphql');
const { DateTimeTypeDefinition, DateTimeResolver } = require('graphql-scalars');
const Location = require('../models/locations.model');

const typeDefs = gql`
    scalar DateTime

    type Pollution {
        datetime: DateTime!
        no2: Float
        o3: Float
        so2: Float
        co: Float
        pm10: Float
        pm2_5: Float
    }

    type Comment {
        user: String!
        comment: String!
        emotion: String!
    }

    type Location {
        name: String!
        long: Float!
        lat: Float!
        address: String
        pollutions: [Pollution]!
        comments: [Comment]!
    }

    type Query {
        locations: [Location]!
        location(locId: String!): Location
    }
`;


const resolvers = {
    DateTime: DateTimeResolver,
    Location: {
        pollutions: async (parent)=>{
            const { name, long, lat } = parent;
            const location = await Location
                .findOne({ name, long, lat })
                .populate({
                    path: 'pollutions',
                    options: { sort: { 'datetime': -1 } }
                })
                .exec();
            return location.pollutions;
        },
        comments: async (parent)=>{
            const { name, long, lat } = parent;
            const location = await Location
                .findOne({ name, long, lat })
                .populate({
                    path: 'comments',
                    select: '-location',
                    options: { sort: { 'updatedAt': -1 } }
                })
                .exec();
            return location.comments;
        }
    },
    Query: {
        locations: async ()=>{
            const locations = await Location
                .find({})
                .populate([{
                    path: 'pollutions',
                    options: { sort: { 'datetime': -1 } }
                }, {
                    path: 'comments',
                    select: '-location',
                    options: { sort: { 'updatedAt': -1 } }
                }])
                .exec();
            return locations;
        },
        location: async (parent, {locId})=>{
            const location = await Location
                .findById(locId)
                .populate([{
                    path: 'pollutions',
                    options: { sort: { 'datetime': -1 } }
                }, {
                    path: 'comments',
                    select: '-location',
                    options: { sort: { 'updatedAt': -1 } }
                }])
                .exec();
            return location;
        }
    }
};

module.exports = { typeDefs, resolvers };

