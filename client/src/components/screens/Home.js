import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import {Link} from 'react-router-dom'
import Loading from '../Loading.js'

const Home = () => {
  const { state} = useContext(UserContext);
  const [data, setData] = useState("");
  const [cmnt, setcmnt] = useState("");
  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteComment = (commentId, postId) => {
    fetch(`/deletecomment/${postId}/${commentId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        commentId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData=data.map(item=>{
            if(item._id==postId){
                const newComments=item.comments.filter(record=>{
                    return record._id!=commentId
                })
                  item.comments=newComments
            }
            return item
        })
        setData(newData);
      });
  };
  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id != result._id;
        });
        setData(newData);
      });
  };
  return (
    
      data?(data.length
        ? data.map((item) => {
            return (
              <div className="home" key={item._id}>
              <div>
              <div className="card home-card">
                <h5 id="otherusername">
                <Link to={item.postedBy._id == state._id ?"/profile":"/profile/"+item.postedBy._id}>
                  <img alt=""
                    id="profile-img-card" style={{float:"left",marginRight:"2%"}}
                    src={item.postedBy.pic}/>
                  </Link>
                  <Link to={item.postedBy._id == state._id ?"/profile":"/profile/"+item.postedBy._id}>{item.postedBy.name}</Link>
                  {item.postedBy._id == state._id ? (
                    <i
                      className="material-icons activator"
                      style={{ float: "right" }}
                    >
                      delete
                    </i>
                  ) : null}
                </h5>
                <div className="card-image">
                  <img src={item.photo} alt="" />
                </div>
                <div style={{ margin: "3% 1%" }}>
                  <div style={{ display: "flex" }}>
                    {item.likes.includes(state._id) ? (
                      <i
                        className="material-icons red-text"
                        onClick={() => {
                          unlikePost(item._id);
                        }}
                      >
                        favorite
                      </i>
                    ) : (
                      <i
                        className="material-icons"
                        onClick={() => {
                          likePost(item._id);
                        }}
                      >
                        favorite
                      </i>
                    )}
                    <h5 style={{ margin: "0.25% 1% 1%" }}>
                      {item.likes.length}{" "}
                      {item.likes.length > 1 || item.likes.length == 0
                        ? "likes"
                        : "like"}
                    </h5>
                  </div>
                  <h4>{item.title}</h4>
                  <p> {item.body} </p>
                  <div style={{ display: "flex", opacity: "0.85" }}>
                    <i
                      className="material-icons tiny"
                      style={{ margin: "0.5% 1% 0% 0%" }}
                    >
                      chat_bubble
                    </i>
                    <h6>
                      {item.comments.length}{" "}
                      {item.comments.length > 1 || item.comments.length == 0
                        ? "comments"
                        : "comment"}
                    </h6>
                  </div>
                  {item.comments.map((record) => {
                    return (
                      <div style={{ opacity: "0.85" }} key={record._id}>
                      {record.postedBy._id == state._id ?
                        <i
                          className="material-icons tiny"
                          style={{ float: "right", marginTop: "0.5%" }}
                          onClick={() => {
                            deleteComment(record._id, item._id);
                          }}
                        >
                          close
                        </i>:null}
                        <div
                          style={{
                            borderLeftStyle: "groove",
                            marginLeft: "3%",
                          }}
                        >
                          <h6 key={record._id}>
                            <span
                              style={{
                                fontWeight: "700",
                                marginRight: "1%",
                                marginLeft: "1%",
                              }}
                            ><Link to={record.postedBy._id == state._id ?"/profile":"/profile/"+record.postedBy._id}>{record.postedBy.name}</Link>
                              :{" "}
                            </span>{" "}
                            {record.text}
                          </h6>
                        </div>
                      </div>
                    );
                  })}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      makeComment(e.target[0].value, item._id);
                      setcmnt("");
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Add comment"
                      value={cmnt}
                      onChange={(e) => {
                        setcmnt(e.target.value);
                      }}
                    />
                  </form>
                </div>
                <div className="card-reveal center">
                  <span className="card-title grey-text text-darken-4">
                    Do you want to delete this post?
                    <i
                      className="material-icons right top"
                      style={{ float: "top !important" }}
                    >
                      close
                    </i>
                  </span>
                  <button
                    className="btn waves-effect waves-light white-text black"
                    style={{ marginTop: "25%", marginRight: "1%" }}
                    onClick={() => deletePost(item._id)}
                  >
                    Delete post
                  </button>
                </div>
              </div>
              </div>
              </div>
            );
          })
        : <h1 className="center" style={{paddingTop:"10%"}}>Nothing to show here!</h1>):<div className="center"><Loading style={{marginTop:"50%"}}/></div>
    
  );
};
export default Home;