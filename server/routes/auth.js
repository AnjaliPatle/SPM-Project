const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const User=mongoose.model("User")
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {JWT_KEY}=require('../keys')
const requireLogin=require('../middleware/requireLogin')


router.post('/signup',(req,res)=>{
    const {name,email,password,pic,bio}=req.body
    if(!email||!password||!name){
        return res.status(422).json({error:"please add all fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User exists with given email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user=new User({
                email,
                password:hashedpassword,
                name,
                bio,
                pic
            })
            user.save()
            .then(user=>{
                res.json({message:"Signed Up successfully"})
            })
            .catch(err=>{
             console.log(err)
            })
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin',(req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        res.status(422).json({error:"Please provide email and password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"No account exists with this email"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const token=jwt.sign({_id:savedUser._id},JWT_KEY)
                const{_id,name,email,followers,following,pic,bio}=savedUser
                res.json({message:"Succesfully signed in",token,user:{_id,name,email,following,followers,pic,bio}})

            }
            else{
                return res.status(422).json({error:"Invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
})
module.exports=router