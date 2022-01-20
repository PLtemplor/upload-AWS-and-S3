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

const app = express();

app.use(cors({
  credentials: true,
  origin: true,
}));



const {
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_ENDPOINT,
  S3_BUCKET,
  HASURA_HOST,
  HASURA_GRAPHQL_ADMIN_SECRET
} = require('../config');

const s3 = new aws.S3({
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY,
  endpoint: S3_ENDPOINT,
});

const dataFiles = [];

function digiUP(req, cb) {

  // Change bucket property to your Space name
  const uploadaw = multer({

    storage: multerS3({
      s3: s3,
      bucket: S3_BUCKET,
      acl: 'public-read',
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

        const variables = { file_path: `https://${S3_BUCKET}.${S3_ENDPOINT}/${file.originalname}` };

        const fetchResponse = await fetch(
          HASURA_HOST,
          {
            method: 'POST',
            headers: {
              'x-hasura-admin-secret': HASURA_GRAPHQL_ADMIN_SECRET,
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

  ).array('uploadaw', 1);


  app.post('/uploadaw', function (request, response, next) {
    uploadaw(request, response, function (err) {
      if (err) {
        error('err post/upload ', err.message);
        error('err post/upload err ', err);
        return response.send(err);
      }
      log('log post/upload dataFiles.', dataFiles);
      log('log post/upload File uploaded successfully.');
      const responseFile = JSON.stringify(dataFiles[dataFiles.length - 1]);
      log('log post/upload responseFile', responseFile)
      response.send(responseFile);
    });
  });

}

module.exports.digiUP = digiUP;
