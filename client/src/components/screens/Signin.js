import React,{useState,useContext} from 'react'
import {Link,useHistory} from "react-router-dom";
import {UserContext} from '../../App'
import M from 'materialize-css'
import Loading from '../Loading'

const Signin=() =>{
    const {dispatch} = useContext(UserContext)
     const history=useHistory()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [loading,setLoading]=useState("false")

    const PostData=()=>{
        setLoading(true)
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                console.log(data.error)
                 M.toast({html: data.error,classes:'mytoasterror'})
                 setLoading(false)
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:data.message,classes:'mytoastsuccess'})
                setLoading(false)
                history.push('/')
            }
        }).catch(err=>{
            setLoading(false)
            console.log(err)
        })
    }

    return (
        loading===true?
        <div className="center"><Loading style={{marginTop:"50%"}}/></div>
        :
        <div className="container-fluid row ">
           <div className="card mycard col-md-5">
            <h1 className="text-center myheading">Photo Sharing App</h1>
            <input type="text" placeholder="Email" value={email}
            onChange={(e)=>setEmail(e.target.value)} required/>
            <input type="password" placeholder="Password" value={password}
            onChange={(e)=>setPassword(e.target.value)} required/>
            <button className="mybutton btn waves-effect waves-light white-text"
            onClick={()=>PostData()}>
            <tt>Login</tt>
            </button>
            <tt className="text-center">
                <Link to="/signup">Don't have an account?
                </Link>
            </tt>
            </div>
        </div>
    )
}
export default Signin
