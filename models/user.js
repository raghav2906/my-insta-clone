const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dhq6gvdfh/image/upload/v1608569323/d37suob-77de95c3-0dbe-456a-b15e-413e977a50d0_sfnsam.jpg"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})

mongoose.model("User",UserSchema)