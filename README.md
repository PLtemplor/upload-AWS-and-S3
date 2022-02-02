# V2 uploader service Backend
 
this is the hero7 service which is used to save files in DigitalOcean and AWS S3, the service was created in Node.js.

 
## Requirements
* Node.js
* Docker
* Postman
 
## Setup
 
### **Environment variable configuration ()**
 
the .envrc is used to be able to connect to an S3 server which in this case would be DigitalOcean and AWS S3

1. should be at the same level as server.js
 
 
2. Copy the base file and edit its content
 
### Example of a valid .env file
 
```
export S3_ACCESS_KEY_ID=your access key id
export S3_SECRET_ACCESS_KEY=your access secret
export S3_ENDPOINT=your endpoint
export S3_BUCKET=your buecket
export S3_REGION=*
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
