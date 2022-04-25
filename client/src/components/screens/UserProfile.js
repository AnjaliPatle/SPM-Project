import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'
import Loading from '../Loading'

const UserProfile=() =>{
    const [loading,setLoading]=useState(false)
    const [showfollow, setShowfollow] = useState(true)
    const {state,dispatch} = useContext(UserContext)
    const {userId}=useParams()
    const [userProfile, setUserProfile] = useState(state?!state.following.includes(userId):false)

    useEffect(() => {
        setLoading(true)
        fetch(`/user/${userId}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setUserProfile(result)
	    console.log(result.user.bio)
            setLoading(false)
        })
    },[])
    useEffect(()=>{
        if(state)
        setShowfollow(!state.following.includes(userId))
    },[state])
    

    const followUser=()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userId
            })
        }).then(res=>res.json())
            .then(data=>{
                console.log("aaja",data)
                dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
                localStorage.setItem("user",JSON.stringify(data))
                setUserProfile((prevState)=>{
                    return {
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:[...prevState.user.followers,data._id]
                        }
                    }
                })
                setShowfollow(false)
            })
        
    }
    const unfollowUser=()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userId
            })
        }).then(res=>res.json())
            .then(data=>{
                console.log("aaja",data)
                dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
                localStorage.setItem("user",JSON.stringify(data))
                setUserProfile((prevState)=>{
                    const newFollower=prevState.user.followers.filter(item=>item!==data._id)
                    return {
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:newFollower
                        }
                    }
                })
                setShowfollow(true)
            })
        
    }

    return (
        loading===true?
        <div className="center"><Loading style={{marginTop:"50%"}}/></div>
        :
        <div style={{maxWidth:"55%",margin:"0px auto"}}>
            <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"5% 0%",
                    paddingLeft:"10%",
                    paddingBottom:"2.5%",
                    borderBottom:"1px solid grey",
                }}>
                <div style={{width:"70%",textAlign:"center"}}>
                    <img alt=""
                    id="userprofile-img"
                    src={userProfile?(userProfile.user?userProfile.user.pic:null):null}/>
                </div>
                <div style={{width:"109%",marginTop:"1%"}}>
                    <h3 id="otherusername">{userProfile?(userProfile.user?userProfile.user.name:"loading"):null}</h3>
                    <div style={{display:"flex", justifyContent:"space-between",width:"50%"}}>
                        <h6>{userProfile?(userProfile.post?userProfile.post.length:"loading..."):null} posts</h6>
                        <h6>{userProfile?(userProfile.user?(userProfile.user.followers?userProfile.user.followers.length:"loading..."):null):null} followers</h6>
                        <h6>{userProfile?(userProfile.user?(userProfile.user.following?userProfile.user.following.length:"loading..."):null):null} following</h6>
                    </div>
                    {userProfile?(userProfile.user?(userProfile.user.bio?<p style={{marginBottom:"0.25rem"}}>{userProfile.user.bio}<br/></p>:""):""):""}
                    {showfollow
                    ?<button
                    className="btn btn-sm waves-effect waves-light white-text black"
                    style={{marginTop:"2%",opacity:"0.9",padding:"0% 1% 0% 1%"}}
                    onClick={() => followUser()}
                  >
                  follow</button>
                  :
                  <button
                    className="btn waves-effect waves-light white-text black"
                    style={{marginTop:"2%",opacity:"0.9",padding:"0% 1% 0% 1%"}}
                    onClick={() => unfollowUser()}
                  >
                  unfollow</button>
                }
                </div>
            </div>
            <div className="gallery">
                 { userProfile?(
                        userProfile.post?(
                            userProfile.post.length?
                            userProfile.post.map(item=>{
                                return <img className="item" src={item.photo} alt={item.title}/>
                            }):console.log("no img"))
                            :null
                 ):null
              }
            </div>
        </div>
    )
}
export default UserProfile
