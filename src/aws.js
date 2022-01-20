"use strict";
// Load dependencies

const { error, log } = console;

const aws = require('aws-sdk');
const fetch = require("node-fetch")
const fs = require('fs');
const multer = require('multer');
const multerS3 = require('multer-s3');
const cors = require('cors');
const express = require("express");
const { Endpoint } = require('aws-sdk');

const app = express();

const PORT = 3002;

app.use(cors({
    credentials: true,
    origin: true,
}));


const {
    S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY,
    S3_ENDPOINT,
    S3_BUCKET,
    S3_REGION,
    HASURA_HOST,
    HASURA_GRAPHQL_ADMIN_SECRET
} = require('../config');
const { response } = require('express');

const s3 = new aws.S3({
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    endpoint: S3_ENDPOINT,
    region: S3_REGION,
    bucket: S3_BUCKET
});

const dataFiles = [];
const dataVariables = [];


function awsUp(req, cb) {

    // Change bucket property to your Space name


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

                const HASURA_MUTATION = `
          mutation ($file_path: String!) {
              insert_files_one(object: {
                  file_path: $file_path
              }) {
                  id
              }
          }
          `;
                //const Bucket = 'juanpruebq';
                //.s3.amazonaws.com
                const variables = { file_path: `https://${S3_BUCKET}.${S3_ENDPOINT}/${file.originalname}` };

                dataVariables.push(variables);

                const fetchResponse = await fetch(
                    'http://localhost:8080/v1/graphql',
                    {
                        method: 'POST',
                        headers: {
                            'x-hasura-admin-secret': 'admin',
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            query: HASURA_MUTATION,
                            variables
                        })
                    }
                );

                const data = await fetchResponse.json();
                log('log upload@data ', data);

                // if Hasura operation errors, then throw error
                if (data.errors) {

                    error('err upload@err ', data.errors);
                    throw new Error('Error updating Hasura ', data.errors[0].message);

                }
            }
        })
    }

    ).array('upload', 1);


    app.post('/upload', function (request, response, next) {
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
        });
    });


    app.delete('/detele-file', function (req, res, next) {

        var fileKey = req.query['fileKey'];

        var params = { Bucket: 'juanpruebq', Key: fileKey };

        s3.deleteObject(params, function (err, data) {
            if (err) console.log(err, err.stack);  
            else log('log delete/delete-file file eliminated.');                 // deleted
        });
        return res.send('object eliminated');
    });
     
    
    
    app.get('/list',function (request, response, next) {
        
            var dataList = [];
            var bucketParams = {
                Bucket : 'juanpruebq',
            };
    
            s3.listObjects(bucketParams, function(err, data) {
                var dataList2 = data;
                //dataList2 = data;
                if (err) {
                    console.log("Error", err);
                } else {
                    
                    console.log("Success", dataList2);
                    dataList.push(dataList2);
                    //response.send(data)
                    //return response.send(dataList2)
                    
                }
                //return response.send(dataList2)
                
            });
            const responseDataList = JSON.stringify(dataList);
            console.log(dataList);
            return response.send(responseDataList)
            
    })

    app.listen(PORT);

}

module.exports.awsUp = awsUp;