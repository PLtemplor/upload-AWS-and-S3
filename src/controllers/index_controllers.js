"use strict";
const controller = {}
const { error, log } = console;

const aws = require('aws-sdk');
const fetch = require("node-fetch")
const multer = require('multer');
const multerS3 = require('multer-s3');
const mongoose = require('mongoose')


const {
    S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY,
    S3_ENDPOINT,
    S3_BUCKET,
    S3_REGION,
} = require('../../config');

const s3 = new aws.S3({
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    endpoint: S3_ENDPOINT,
    region: S3_REGION,
    bucket: S3_BUCKET
});

const filesSchema = mongoose.Schema({
    name:String,
    file:String
}, {versionKey: false})

const filesModel = mongoose.model('files', filesSchema)



const dataFiles = [];
const dataVariables = [];
const original = [];

const upload = multer({


    storage: multerS3({
        s3: s3,
        bucket: S3_BUCKET,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: async function (request, file, cb) {
            log('log upload@file ', file);
            cb(null, file.originalname);
            dataFiles.push(file);
            original.push(file.originalname);
        
            const variables = { file_path: `https://${S3_BUCKET}.${S3_ENDPOINT}/${file.originalname}` };

            dataVariables.push(variables);
            
        }
    })
}

).array('upload', 1);

const createFilesMongo = async ()=>{
    const filesmongo = new filesModel({
        name: `${original}`,
        file: `https://${S3_BUCKET}.${S3_ENDPOINT}/${original}`
    })
    const result = await filesmongo.save()
    console.log(result);
}


controller.uploadObject = (request, response, next) => {
    upload(request, response, function (err) {
        if (err) {
            error('err post/upload ', err.message);
            error('err post/upload err ', err);
            return response.send(err);
        }
        log('log post/upload dataFiles.', dataFiles);
        log('log post/upload dataVariables.', dataVariables);
        log('log post/upload File uploaded successfully.');
        const responseFile = JSON.stringify(dataFiles[dataFiles.length - 1]);
        const responseData = JSON.stringify(dataVariables[dataVariables.length - 1]);

        log('log post/upload responseFile', responseFile)
        response.send([
            responseFile,
            responseData
        ]);
        createFilesMongo()
    });
}


controller.filter = async (req, res) =>{

    const { texto } = req.params 
    let listFiles = await filesModel.find({name: new RegExp('^'+texto+'$', "i")})
    res.json( listFiles )
}


controller.deleteMongo = async (req, res) => {
     const { id } = req.params
     await filesModel.deleteOne({ _id: id })
     res.json({ msg:'deleted file' })
}

controller.deleteObjects = (req, res, next) => {

    var fileKey = req.query['fileKey'];

    var params = { Bucket: 'iqt-test', Key: fileKey };

    s3.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack);
        else log('log delete/delete-file file eliminated.'); // deleted
    });
    return res.send('object eliminated');
   
}

module.exports = controller

