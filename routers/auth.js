const express = require('express')
const router = new express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRETS} = require('../config/key')
const requireLogin = require('../middleware/requirelogin')


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

module.exports = router