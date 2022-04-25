import React,{useContext,useState,useRef,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const Navbar=()=> {
  const searchModal=useRef(null)
  const history=useHistory()
  const {state,dispatch}=useContext(UserContext)
  const [search, setSearch] = useState("")
  const [result, setResult] = useState([])

  useEffect(() => {
    M.Modal.init(searchModal.current)
  }, [])
  const renderList=()=>{
    if(state){
      return [
        <li key="7">
              <i className="material-icons modal-trigger" style={{fontSize:"2.1em",opacity:"0.9",color:"black"}} data-target="modal1">
              search</i>
        </li>,
        <li key="1"><Link to="/followedposts" style={{marginLeft:"0%"}}>
              <i className="material-icons" style={{fontSize:"2.25em",opacity:"0.9"}}>burst_mode</i>
          </Link>
        </li>,
        <li key="2"><Link to="/createpost">Create Post</Link></li>,
        <li key="3"><Link to="/profile">Profile</Link></li>,
        <li key="4"><button className= "btn waves-effect waves-light white-text black logout"
        onClick={()=>{
          localStorage.clear()
          dispatch({type:"CLEAR"})
          history.push('/signin')
        }}>
        Logout</button></li>
      ]
    }
    else{
      return [
        <li key="5"><Link to="/signin">Sign In</Link></li>,
        <li key="6"><Link to="/signup">Sign Up</Link></li>
      ]
    }
  }
  const searchUser=(query)=>{
    setSearch(query)
    fetch('/search-users',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(results=>{
      setResult(results.user)
    })
  }
const closeSearch=()=>{
  setSearch("")
  searchUser("")
}

    return (
      <div>
  <nav>
    <div className="nav-wrapper white" >
      <Link to={state?"/":"/signin"} className="left Title brand-logo" >Photo Sharing App</Link>
      <ul id="nav-mobile" className="right">
        {renderList()}
      </ul>
    </div>
  </nav>
  <div id="modal1" className="modal" ref={searchModal} style={{width:"50%",color:"black",overflow:"auto !important",height:"fit-content"}}>
    <div className="modal-content" style={{margin:"3% 3% 3% 3%",width:"94%",padding:"1%",border:"none",background:"none"}}>
      <input type="text" placeholder="Search Users" value={search}
            onChange={(e)=>searchUser(e.target.value)} required/>
    </div>
    <ul className="collection" style={{margin:".5rem 1rem 1rem 1rem"}}>
    {result.length?
      result.map(item=>{
        return <Link className="modal-close" onClick={()=>closeSearch()} to={item._id === state._id ?"/profile":"/profile/"+item._id}>
        <li className="collection-item">
          {item.name}
        </li>
        </Link>
      })
    :(search===""?null:<h4 className="center">No users matched your search</h4>)}
      
    </ul>
    <div className="modal-footer">
      <button  className="modal-close waves-effect waves btn-flat" onClick={()=>closeSearch()}>Close</button>
    </div>
  </div>
  </div>
        
    )
}
export default Navbar