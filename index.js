const connectToMongo = require('./db');
const express = require('express')
const app = express();
const port = 5000 ;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToMongo();

// available routes 
app.get('/',(req,res)=>{
    res.send('Hello Rakesh')
})
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port,()=>{
    console.log(`App is Listening at http://localhost:${port}`)
})


