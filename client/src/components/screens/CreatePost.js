import React,{useState,useEffect} from 'react'
import {useHistory} from "react-router-dom";
import M from 'materialize-css'
import Loading from '../Loading'

const CreatePost=()=> {
    const history=useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    useEffect(() => {
       if(url){
        fetch("/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                img:url
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                console.log(data.error)
                 M.toast({html: data.error,classes:'mytoasterror'})
            }
            else{
                M.toast({html:"New Post Created!",classes:'mytoastsuccess'})
                setLoading(false)
                history.push('/')
            }
        }).catch(err=>{
            console.log(err)
        })
       }
    },[url])
    const postDetails=()=>{
        setLoading(true)
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
            console.log(data)
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
    }


    return (
        loading===true?
        <div className="center"><Loading style={{marginTop:"50%"}}/></div>
        :
        <div className="card input-field"
        style={{
            margin:"10% auto",
            maxWidth:"40%",
            padding:"2%",
            textAlign:"center"
        }}
        >
        <input type="text" placeholder="Caption"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}/>
        <input type="text" placeholder="Description"
        value={body}
        onChange={(e)=>setBody(e.target.value)}/>
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
        onClick={()=>postDetails()}>
            <tt>Upload</tt>
            </button>
        </div>
    )
}
export default CreatePost