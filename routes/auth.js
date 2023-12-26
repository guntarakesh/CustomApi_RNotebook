const cors = require('cors')({ origin: true });
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const JWT_SECRET = 'HarryisagoodBoy';
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchUser')

// Route-1  create a user (Sign Up) using POST: '/api/auth/createuser'
router.post('/createuser',[
    body('name', 'enter a valid that that must contain min 3 characters').isLength({ min: 3 }),
    body('email', 'enter a valid mail').isEmail(),
    body('password', 'password must be min 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    let success = false ; 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({success, errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ success, error: 'This Email id Already in use' })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password,salt);
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        })
        // .then(user=>res.json(user))
        // .catch(err=>{console.log(err)
        // res.json({error:'please enter another email'})})
        const data = {
            user:{
                id:user.id
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);

        // res.json user 
        success = true ; 
        res.json({success,authToken})
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("some error ocurred");
    }
})

// Route-2 authenicate a user using POST "/api/auth/login"  (Sign In)

router.post('/login',[
    body('email',"Enter a Valid Email").isEmail(),
    body('password',"password not found").exists(),
],async (req,res)=>{

    await cors(req,res);
    let success = false ; 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({success, errors: errors.array() });
    }

    const {email,password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({ success,Error: "Please Login with valid Email id"})
        }

        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare) {
            return res.status(400).json({success,Error:"please Login with correct password"});
        }

        const data = {
            user:{
                id:user.id
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);

        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        success = true ; 
        res.json({success,authToken})

    }
    catch(error){
      console.error(error.message)
      res.status(500).json({success,Error:"Some Internal Erro Ocurred"})
    }
});

// Route-3 information for loggedin user using POST: "/api/auth/getuser"  Login Required 

router.post('/getuser', fetchuser ,async (req,res)=>{
    try {
        const userid = req.user.id ; 
        const user = await User.findById(userid).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({Error:"Some Internal Erro Ocurred"})
    }
    
})

module.exports = router 