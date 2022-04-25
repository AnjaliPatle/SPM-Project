import React,{useState,useEffect} from 'react'
import {Link,useHistory} from "react-router-dom";
import M from 'materialize-css'
import Loading from '../Loading'

const Signup=() =>{
    const history=useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [bio, setBio] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)
    const [loading,setLoading]=useState("false")
    const validEmailRegex = 
  RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
    
    useEffect(() => {
        if(url){
            uploadFields()
        }
    }, [url])

    const uploadPic=()=>{
        const data=new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","instacloneanjali")
        fetch("https://api.cloudinary.com/v1_1/instacloneanjali/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>{
            setLoading(false)
            console.log(err)
        })
    }

    const uploadFields=()=>{
        if(!validEmailRegex.test(email)){
            M.toast({html:'Please enter a valid Email',classes:'mytoasterror'})
            setLoading(false)
        }
        else if(password.length <6){
            M.toast({html:'Password length should be minimum 6 characters',classes:'mytoasterror'})
            setLoading(false)
        }
        else{
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                bio,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            setLoading(false)
            if(data.error){
                 M.toast({html: data.error,classes:'mytoasterror'})
                 setLoading(false)
            }
            else{
                M.toast({html:data.message,classes:'mytoastsuccess'})
                history.push('/signin')
            }
        }).catch(err=>{
            setLoading(false)
            console.log(err)
        })
        }
    }
    const PostData=()=>{
        setLoading(true)
        if(image){
            uploadPic()
        }
        else{
            uploadFields()
        }
        
    }
    
    return (
        loading===true?
        <div className="center"><Loading style={{marginTop:"50%"}}/></div>
        :
        <div className="container-fluid row ">
           <div className="card mycard col-md-5">
            <h1 className="text-center myheading">Photo Sharing App</h1>
            <input type="text" placeholder="Name" value={name}
            onChange={(e)=>setName(e.target.value)} required/>
            <input type="text" placeholder="Email" value={email}
            onChange={(e)=>setEmail(e.target.value)} required/>
            <input type="password" placeholder="Password" value={password}
            onChange={(e)=>setPassword(e.target.value)} required/>
            <input type="text" placeholder="Something about yourself" value={bio}
            onChange={(e)=>setBio(e.target.value)}/>
            <div className="file-field input-field ">
            <div className= "btn waves-effect waves-light white-text black "  style={{paddingBottom:"10%"}} >
                <span>Upload Image</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
        </div>
            <button className="mybutton btn waves-effect waves-light white-text"
            onClick={()=>PostData()}>
            <tt>Sign Up</tt>
            </button>
            <tt className="text-center ">
                <Link to="/signin">Already have an account?
                </Link>
            </tt>
            </div>
        </div>
    )
}
export default Signup
