"use strict";
const express = require('express');
const router = express.Router();
const controller = require('../controllers/index_controllers.js');


router.post('/upload', controller.uploadObject);

router.delete('/delete-file',controller.deleteObjects);

router.get('/list/:texto', controller.filter);

router.delete('/delete-mongo/:id', controller.deleteMongo);


module.exports = router