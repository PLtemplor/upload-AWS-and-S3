# V2 uploader service Backend
 
this is the hero7 service which is used to save files in DigitalOcean, then save its url in a database using Hasura, the service was created in Node.js.

currently it depends on the Hasura service.
 
## Requirements
* Node.js
* Postgres:12
* PgAdmin4
* Docker
* Postman
 
## Setup
 
### **Environment variable configuration ()**
 
the .envrc is used to be able to connect to an S3 server which in this case would be DigitalOcean and also to the Hasura service

1. should be at the same level as server.js
 
 
2. Copy the base file and edit its content
 
### Example of a valid .env file
 
```
export S3_ACCESS_KEY_ID=your access key id
export S3_SECRET_ACCESS_KEY=your access secret
export S3_ENDPOINT=your endpoint
export S3_BUCKET=your buecket
export HASURA_HOST=your hasura host
export HASURA_GRAPHQL_ADMIN_SECRET=your key code
```
 
## Install
 
```
npm install
```

create .envrc 
put the environment variables
 
## Run
 
### **How to run locally**
 
To run the project, **remember to first set the environment variables**, else errors could occur due to missing environment variables.
 
Once that's done just execute
 
```
source .envrc
npm start
```
 
### **How to run in production**
 
If you want to create a production compilation, simply run your Postman with a POST request with your url, in the body we choose form-data and with the keyword 'upload' we choose the file to upload in the value.

with this url the service is consumed.
 
```
http://your-local-host/upload
```
 
### **Using Docker**
```
docker build -t upload .
docker run -d 3000:3000 upload
```
 
 
## Authors

* Juan Grisales <juan.grisales@cuemby.com>
