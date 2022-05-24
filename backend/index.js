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

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

const tokenValidator = require('./middlewares/tokenValidator');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');
const commentsRoute = require('./routes/comments');
const locationsRoute = require('./routes/locations');
const usersRoute = require('./routes/users');
const { typeDefs, resolvers } = require('./routes/graphql');
const {HttpNotFoundError} = require('./errors/HttpErrors');

const config = require('./config.json');

const app = express();
const apolloServer = new ApolloServer({ typeDefs, resolvers });

mongoose.connect(config.database_url);
const db = mongoose.connection;
db.on('error', () => console.error.bind(console, 'Connection Error:'));
db.once('open', () => console.log('Database connection opened!'));

// Middlewares
app.use(cors(), tokenValidator, requestLogger, express.json());

// GraphQL
apolloServer.start().then(res=>{
    apolloServer.applyMiddleware({ app });
})
.finally(()=>{

// Routes
app.use('/comments', commentsRoute);
app.use('/locations', locationsRoute);
app.use('/users', usersRoute);

//React App
app.use(express.static(path.join(__dirname, "..", "frontend","build")));
app.get('*', (req, res)=>res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html')));

// Error middleware
app.all('/*', (req, res, next) => {throw new HttpNotFoundError("Invalid Path!")});
app.use(errorHandler);


});


const server = app.listen(config.port, () => {
    console.log(`Backend server listening at port ${config.port}.`);
});
