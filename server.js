"use strict";
const config = require('config');
const app = require('./src/app');



app.listen(config.get('port'));