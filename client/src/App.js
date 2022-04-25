import React,{useEffect,createContext,useReducer,useContext} from 'react';
import Navbar from './components/Navbar.js'
import './App.css'
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/screens/Home'
import Signin from './components/screens/Signin'
import Signup from './components/screens/Signup'
import Profile from './components/screens/Profile'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
import SubPost from './components/screens/SubPost'
import EditProfile from './components/screens/EditProfile'
import Footer from './components/Footer.js'
import {reducer,initialState} from './reducers/userReducer'

export const UserContext=createContext()

const Routing=()=>{
  const history=useHistory()
  const {dispatch}=useContext(UserContext)
  useEffect(() => {
    const user=JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }
    else{
      history.push('/signin')
    }
  }, [])
  return(
    <Switch>
    <Route exact path="/">
    <div className="main-content">
      <Home/>
    </div>
    </Route>
    <Route path="/signin">
    <div className="main-content">
      <Signin/>
    </div>
    </Route>
    <Route path="/signup">
    <div className="main-content">
      <Signup/>
      </div>
    </Route>
    <Route path="/createpost">
    <div className="main-content">
      <CreatePost/>
    </div>
    </Route>
    <Route exact path="/profile">
    <div className="main-content">
      <Profile/>
    </div>
    </Route>
    <Route path="/profile/:userId">
    <div className="main-content">
      <UserProfile/>
    </div>
    </Route>
    <Route path="/followedposts">
    <div className="main-content">
      <SubPost/>
    </div>
    </Route>
    <Route path="/edit-profile">
    <div className="main-content" id="edit">
      <EditProfile/>
    </div>
    </Route>
    </Switch>
  )
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <div className="Navbar">
    <Navbar/>
    </div>
    <Routing/>
    <Footer/>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
