"use strict";
const express = require("express");

const app = express();



const awsUP = require('./src/aws.js');
const upDigi = require('./src/digiOcen.js');

//awsUP.uploadAWS();
//upDigi.digiUP();
awsUP.awsUp();


