const express = require("express")
const {User,Accounts} = require("../db")
const zod = require("zod");
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../config")
const router = express.Router();
const {authMiddleware} = require('../middleware')


const signupCheck = zod.object({
    username : zod.string().email(),
    firstName : zod.string(),
    lastName : zod.string(),
    password : zod.string(),
})
const signinCheck = zod.object({
    username : zod.string().email(),
    password : zod.string()
})
const changesCheck = zod.object({
    password : zod.string().optional(),
    firstName : zod.string().optional(),
    lastName : zod.string().optional()
})





router.post("/signup",async (req,res)=>{
    const body = req.body;
    // console.log(body)
    const {success} = signupCheck.safeParse(body)
    if(!success){
        return res.status(411).send({
            "Msg" : "Check your details"
        })
    }
    const existingUser = await User.findOne({
        "username" : body.username
    })
    if(existingUser){
        return res.status(411).json({
            "Msg" : "User exists in database"
        })
    }
    const newUser = await User.create({
        "username" : body.username,
        "password" : body.password,
        "firstName" : body.firstName,
        "lastName" : body.lastName
    })
    const newUserAccount = await Accounts.create({
        "userId" : newUser._id,
        "balance" : Math.floor(Math.random()*1000 + 1)
    })
    const user_id = newUser._id;
    
    const token = jwt.sign({
        user_id
    },JWT_SECRET);
    res.json({
        "Msg" : "Your account created",
        token : token
    })
})

router.post("/signin",async(req,res)=>{
    const body = req.body;
    console.log(body)
    const {success} = signinCheck.safeParse(body);
    if(!success){
        return res.status(411).json({
            "Msg" : "Enter valid details"
        })
    }
    const user = await User.findOne({username : body.username, password : body.password})
    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})


router.put("/", authMiddleware, async (req, res) => {
    const body = req.body
    const { success } = changesCheck.safeParse(body);
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        });
    }
    try{
        const userId = req.userId;
        await User.updateOne(
            {_id : userId},
            {$set : body}
        )
    
        res.json({
            message: "Updated successfully"
        });
    }catch(err){
        res.json({
            message: err
        });
    }
});



router.get("/bulk",async (req,res)=>{
    const parameter = req.query.filter || "";
    console.log(parameter)
    const users = await User.find({
        $or: [
                { 
                    "firstName": {"$regex": parameter} 
                }, 
                { 
                    "lastName": {"$regex": parameter} 
                }
            ]
        });
    res.json({
        "users": users
    })
})





















module.exports = router