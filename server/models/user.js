const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const userSchema= new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/instacloneanjali/image/upload/v1595503468/none_ssjuwc.jpg"
    },
    bio:{
        type:String,
        default:""
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})
mongoose.model("User",userSchema)