"use strict";
const cors = require('cors');
const express = require("express");
const routes = require('./routes/index_routes.js');
const mongodb = require('./database/mongo_connect.js');


const config = require('config');

const app = express();

app.use(cors({
    credentials: true,
    origin: true,
}));

//connect database
mongodb.mongoconnect();

//routes
app.use(routes);


module.exports = app;