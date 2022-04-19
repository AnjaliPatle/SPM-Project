const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const requireLogin=require('../middleware/requireLogin')
const Post=mongoose.model("Post")
const User=mongoose.model("User")

router.get('/user/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,post)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user,post})
        })
    })
    .catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})

router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{new:true},(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})
router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{new:true},(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put('/updatepic',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set: {pic:req.body.pic}},{new:true},
    (err,result)=>{
        if(err){
            return res.status(422).json({error:"Image Uploading Failed."})
        }
        res.json(result)
    })   
})
router.put('/deletedp',requireLogin,(req,res)=>{
    User.findByIdAndUpdate({_id:req.user._id},{$set: {pic:"https://res.cloudinary.com/instacloneanjali/image/upload/v1595503468/none_ssjuwc.jpg"}},{new:true},
    (err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        res.json(result)
    })
})

router.post('/search-users',(req,res)=>{
    let userPattern=new RegExp("^"+req.body.query)
    User.find({name:{$regex:userPattern,$options:'i'}})
    .select("_id email name")
    .then(user=>{
        if(req.body.query.length===0)
        user=[]
        res.json({user})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/updateprofile',requireLogin,(req,res)=>{
    User.findByIdAndUpdate({_id:req.user._id},{$set: {name:req.body.name,bio:req.body.bio}},{new:true},
    (err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        res.json(result)
    })
})
router.delete('/deleteprofile',requireLogin,(req,res)=>{
    User.findOne({_id:req.user._id})
    .exec((err,targetUser)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            console.log(targetUser)
            Post.find({postedBy:req.user._id}).
            exec((error,posts)=>{
                if(error){
                    return res.status(422).json({error})
                }
                else{
                    posts.map(item=>{
                        item.remove()
                    })
                }
            })
            targetUser.following.map(f=>{
                User.findByIdAndUpdate({_id:f._id},{$pull: {followers:req.user._id}},{new:true},(err,result)=>{
                if(err){
                    return res.status(422).json({error:err})
                }
                console.log(result)
            })
            })
            targetUser.followers.map(f=>{
                User.findByIdAndUpdate({_id:f._id},{$pull: {following:req.user._id}},{new:true},(err,result)=>{
                if(err){
                    return res.status(422).json({error:err})
                }
                console.log(result)
            })
            })
            targetUser.remove()
            .then(result=>{
                res.json(result)
            })
            .catch(err=>{
                console.log(err)
            })
        }
    })
})

module.exports=router