import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../App'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'


function MyModal(props) {
const {state,dispatch} = useContext(UserContext)
const [image, setImage] = useState("")
const [url, setUrl] = useState("")
    
// useEffect(() => {
//   if(image){
//     console.log("hoo1",image)
//     const data=new FormData()
//         data.append("file",image)
//         data.append("upload_preset","insta-clone")
//         data.append("cloud_name","instacloneanjali")
//         fetch("https://api.cloudinary.com/v1_1/instacloneanjali/image/upload",{
//             method:"post",
//             body:data
//         })
//         .then(res=>res.json())
//         .then(data=>{
//             fetch('/updatepic',{
//               method:"put",
//               headers:{
//                 "Content-Type":"application/json",
//                 "Authorization":"Bearer "+localStorage.getItem("jwt")
//               },
//               body:JSON.stringify({
//                   pic:data.url
//               })
//             }).then(res=>res.json())
//             .then(result=>{
//               console.log("ho gya",result)
//                localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
//                dispatch({type:"UPDATEPIC",payload:result.pic})
//                props.loadingfalse()
//             })
//         })
//         .catch(err=>{
//             console.log(err)
//         })
//   }
// }, [image])


const updatePic=(file)=>{
    props.onHide();
    props.loadingtrue();
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
            fetch('/updatepic',{
              method:"put",
              headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                  pic:data.url
              })
            }).then(res=>res.json())
            .then(result=>{
               localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
               dispatch({type:"UPDATEPIC",payload:result.pic})
               props.loadingfalse()
            })
        })
        .catch(err=>{
            console.log(err)
        })
}

const deleted=()=>{
  fetch('/deletedp',{
    method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
  })
  .then((res) => res.json())
  .then((result) => {
  localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
  dispatch({type:"UPDATEPIC",payload:result.pic})
  props.onHide();
  });
};
 

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" style={{marginLeft:"20%"}}>
          Update Profile Picture
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="center">
       <div className="file-field input-field ">
            <div className= "btn btn-sm waves-effect waves-light white-text black center"  style={{padding:"0% 2%"}} >
                <span>Select Image</span>
                <input type="file"  onChange={(e)=>setImage(e.target.files[0])}/>
            </div>
          <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
        </div>
         <button className="btn waves-effect waves-light white-text green"
        onClick={()=>updatePic()} disabled={image===""?true:false} style={{width:"100%"}}>
            <tt>Update Image</tt>
            </button>
            <hr/>
        <div className="file-field input-field ">
            <button className="btn waves-effect waves-light white-text" style={{padding:"0% 2%", marginRight:"10%",backgroundColor:"#c62828",width:"100%"}} onClick={deleted}>
              Delete Image
            </button>
        </div>
        
      </Modal.Body>
    </Modal>
  );
}

export default MyModal;