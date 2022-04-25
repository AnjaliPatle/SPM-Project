import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import Loading from '../Loading'
import MyModal from '../modal'

const Profile=() =>{
    const [loading,setLoading]=useState(false)
    const [picloading,setpicLoading]=useState(false)
    const [mypics, setMypics] = useState([])
    const [modalShow, setModalShow] = React.useState(false);
    const {state} = useContext(UserContext)
    useEffect(() => {
        setLoading(true)
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setMypics(result.myposts)
            setLoading(false)
        })
    },[])
    return (
        loading===true?
        <div className="center"><Loading style={{marginTop:"50%"}}/></div>
        :
        <div style={{maxWidth:"55%",margin:"0px auto"}}>
            <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"2.5% 0% 5% 0%",
                    paddingLeft:"10%",
                    paddingBottom:"2.5%",
                    borderBottom:"1px solid grey",
                }}>
                <div className="container" style={{width:"50%",textAlign:"center"}}>
                    {picloading===true?
                        <div className="center"><Loading style={{marginTop:"50%"}}/></div>
                    :<img alt=""
                    id="profile-img"
                    src={state?state.pic:null}/>}
                    <div className="middle">
                         <button className="btn btn-sm waves-effect waves-light white-text black" onClick={() =>setModalShow(true)}>Update</button>
                    </div>
                </div>
                <div style={{width:"109%",marginTop:"2.5%"}}>
                    <h3 id="username">{state?state.name:"loading"}
                    <Link to="/edit-profile">
                    <i
                      className="material-icons"
                      style={{ float: "center",fontSize:"0.6em",marginLeft:"1%",opacity:"0.85"}}
                    >
                      settings
                    </i> </Link>
                    </h3>
                    <div style={{display:"flex", justifyContent:"space-between",width:"50%"}}>
                        <h6>{mypics.length} posts</h6>
                        <h6>{state?(state.followers?state.followers.length:"loading"):"loading"} followers</h6>
                        <h6>{state?(state.following?state.following.length:"loading"):"loading"} following</h6>
                    </div>
                    
                    {state?state.bio:"loading..."}
                </div>
            </div>
            <div className="gallery">
                {   mypics.length?
                    mypics.map(item=>{
                        return <img className="item" src={item.photo} alt={item.title}/>
                    }):<h3 style={{paddingTop:"10%"}}>No Posts Yet...</h3>
                }
            </div>
      <MyModal loadingtrue={()=>setpicLoading(true)}
      loadingfalse={()=>setpicLoading(false)}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
        </div>
    )
}
export default Profile
