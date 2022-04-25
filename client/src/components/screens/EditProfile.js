import React,{useState,useEffect,useContext,useRef} from 'react'
import {UserContext} from '../../App'
import {Link,useHistory} from "react-router-dom";
import M from 'materialize-css'
import Loading from '../Loading'

 const EditProfile=() =>{
  const deleteModal=useRef(null)
    const history=useHistory()
    const {state,dispatch} = useContext(UserContext)
    const [name, setName] = useState("")
    const [bio, setBio] = useState("")
    const [loading,setLoading]=useState("false")
    
    useEffect(() => {
        M.Modal.init(deleteModal.current)
    }, [])
    
    useEffect(() => {
        if(state){
        setName(state.name)
        setBio(state.bio)
        }
    }, [state])
    

    const updateFields=()=>{
        setLoading(true)
        fetch("/updateprofile",{
            method:"put",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                bio,
            })
        }).then(res=>res.json())
        .then(data=>{
            setLoading(false)
            if(data.error){
                 M.toast({html: data.error,classes:'mytoasterror'})
            }
            else{
                M.toast({html:"Updated Successfully!",classes:'mytoastsuccess'})
                dispatch({type:"UPDATEPROFILE",payload:{name:data.name,bio:data.bio}})
                history.push('/profile')
            }
        }).catch(err=>{
            console.log(err)
        })
        }
    const deleteProfile=()=>{
        fetch('/deleteprofile', {
        method: "delete",
        headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setLoading(false)
        localStorage.clear()
        history.push('/signin')
      });
    }
    return (
        loading===true?
        <div className="center"><Loading/></div>
        :
        <div className="container-fluid row " >
           <div className="card mycard col-md-5">
            <h1 className="text-center" style={{paddingTop:"5%"}}>Edit Profile</h1>
            <input type="text" placeholder="Name" value={name}
            onChange={(e)=>setName(e.target.value)} required/>
            <input type="text" placeholder="Something about yourself" value={bio}
            onChange={(e)=>setBio(e.target.value)}/>
            <div style={{display:"flex"}}>
            <button className="black btn waves-effect waves-light white-text" style={{width:"47%",marginRight:"5%",marginBottom:"3%",marginTop:"3%"}}
            onClick={()=>history.push('/profile')}>
            <tt>Back</tt>
            </button>
            <button className="black btn waves-effect waves-light white-text" style={{width:"47%",marginBottom:"3%",marginTop:"3%"}}
            onClick={()=>updateFields()}>
            <tt>Save Changes</tt>
            </button>
            </div>
            <button className="btn waves-effect white-text modal-trigger" data-target="modal2" style={{marginTop:"0%",marginBottom:"2%",backgroundColor:"#c62828"}}>
            <tt>Delete Profile</tt>
            </button>
            </div>
            <div id="modal2" ref={deleteModal} className="modal">
            <div className="modal-content">
             <h4>Are you sure you want to delete your Profile?</h4>
                </div>
                <div className="modal-footer">
                <Link  className="modal-close waves-effect waves btn-flat" onClick={()=>deleteProfile()}>Confirm</Link>
                </div>
                </div>
        </div>
    )
}
export default EditProfile

