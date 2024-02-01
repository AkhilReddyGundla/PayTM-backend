const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const { Schema } = require('zod');
mongoose.connect('mongodb+srv://akhilreddygundla:Akhil%40_06@cluster0.1rlofxa.mongodb.net/PayTM?retryWrites=true&w=majority');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required: true,
        trim:true,
        minLength : 2,
        maxLength : 50,
    },
    password : {
        type : String,
        required : true,
        trim:true,
        minLength :2,
        maxLength : 20
    },
    firstName : {
        type : String,
        required : true,
        trim : true,
        maxLength : 20
    },
    lastName : {
        type : String,
        required : true,
        trim : true,
        maxLength : 20
    }
})

const bankSchema = mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    balance : {
        type : Number,
        required : true
    }
})


const User = mongoose.model("User",userSchema);
const Accounts = mongoose.model("Accounts",bankSchema)
module.exports = {
    User,Accounts
}