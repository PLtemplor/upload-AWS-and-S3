const mongoose = require('mongoose')

const {
    MONGO_USER,
    MONGO_PASSWORD,
    DB_NAME,
} = require('../../config.js');


const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.oruch.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

function mongoconnect(req, cb) {
   mongoose.connect(uri, {

    useNewUrlParser: true,
    useUnifiedTopology: true,

})
.then( ()=>{console.log('CONNECTED MONGO')} )
.catch( (e)=>{console.log('error connected mongo: '+ e);} )
}



module.exports.mongoconnect = mongoconnect;