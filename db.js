const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://guntarakesh7:A3offdPoemkicjih@cluster0.oxayffk.mongodb.net/?retryWrites=true&w=majority"

const connectToMongo = async()=>{
   try {
      mongoose.set("strictQuery", false);
      await mongoose.connect(mongoURI, {
         useNewUrlParser: true,
         useUnifiedTopology: true
      });
      console.log("Connected to MongoDB successfully");
   }
   catch(error){
    console.log(error);
   }
};

module.exports = connectToMongo 