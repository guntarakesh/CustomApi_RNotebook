var jwt = require('jsonwebtoken');
const JWT_SECRET = 'HarryisagoodBoy';

const fetchuser = (req,res,next)=>{
    // get the user from jwt token and ad id to req object 
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"please Login Using Valid id"});
    }
    try {
    const data = jwt.verify(token,JWT_SECRET);
    req.user = data.user; 
    next()   
    } catch (error) {
        res.status(401).send({error:"please authenicate"});
    }
    
}

module.exports = fetchuser;