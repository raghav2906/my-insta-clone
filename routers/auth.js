const express = require('express')
const router = new express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRETS} = require('../config/key')
const requireLogin = require('../middleware/requirelogin')
const nodemailer=require('nodemailer')
const sendgridTransport=require('nodemailer-sendgrid-transport')
const {SENDGRID_API,EMAIL} =require('../config/key')
const transport = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))

router.get('/protected',requireLogin,(req,res)=>{
    res.send("hello user")
})

router.post('/signup',(req,res) => {
    const {name,email,password,pic} = req.body
    if(!email || !password || !name){
        res.status(422).json({error:"Please filll all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User already exists with that email "})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword => {
            const user = new User({
                email,
                password:hashedpassword,
                name,
                pic:pic
            })
    
            user.save()
            .then((user)=>{
                transport.sendMail({
                    to:user.email,
                    from:"raghav.agarwalqw77@gmail.com",
                    subject:"signed up successfuly",
                    html:"<h1>Welcome to my clone</h1>"
                })
                res.json({message:"Saved succesfully"})
            })
            .catch(err => {console.log(err)})
        })
        
    })
    .catch(err => {console.log(err)})
})

router.post('/signin',(req,res)=> {
    const {email,password} = req.body
    if(!email || !password){
        res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"succesfully signed in"})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRETS)
                const  {_id,name,email,followers,following,pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid password"})
            }
        })
        .catch(err=>{console.log(err)})
    })
    .catch(err=>{console.log(err)})
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email}).then(user=>{
            if(!user){
                return res.status(422).json({error:"email doesn't exists!"})
            }
            user.reset=token
            user.expire= Date.now() + 600000
            user.save().then((result)=>{
                transport.sendMail({
                    to:user.email,
                    from:"raghav.agarwalqw77@gmail.com",
                    subject:"reset password request",
                    html: `
                    <p>You requested to reset your password</p>
                    <h4> click <a href="${EMAIL}/reset/${token}">here</a> for further procedure</h4> 
                    `
                })
                res.json({message:"check your mail"})
            }).catch(err=>{
                return res.status(422).json({error:err})
            })
        })
        .catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.post('/new-password',(req,res)=>{
    const NewPassword=req.body.password
    const token=req.body.token
    User.findOne({reset:token,expire:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Resquest Expired"})
        }
        bcrypt.hash(NewPassword, 12).then(hashedpassword=>{
            user.password=hashedpassword
            user.reset=undefined
            user.expire=undefined
            user.save().then(result=>{
                res.json({message:"Succesfuly updated password"})
            })
        }).catch(err=>{
            res.status(422).json({error:err})
        })
    }).catch(err=>{
        res.status(422).json({error:err})
    })
})

module.exports = router