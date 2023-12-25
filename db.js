const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1/inotebook?directConnection=true"

const connectToMongo = async()=>{
   try{
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoURI);
    console.log("Connected to mongodb sucessfully");
   }
   catch(error){
    console.log(error);
   }
};

module.exports = connectToMongo 