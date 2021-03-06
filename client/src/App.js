import React,{useEffect,createContext,useReducer,useContext} from 'react'
import './App.css';
import Login from './components/screens/login'
import NavBar from './components/Navbar'
import {BrowserRouter,Route,Switch, useHistory} from 'react-router-dom'
import Home from './components/screens/Home'
import Signup from './components/screens/signup'
import Profile from './components/screens/profile'
import CreatePost from './components/screens/CreatePost'
import {reducer,initialState} from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile'
import SubPost from './components/screens/SubPost'
import Reset from './components/screens/Reset'
import NewPassword from './components/screens/NewPassword'

export const UserContext = createContext()


const Routing = () => {
  const history = useHistory()

  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    // console.log(user)
    if(user){
      dispatch({type:"USER",payload:user})
      
    }
    else{
      if(!(history.location.pathname.startsWith('/reset')))
      history.push('/login')
    }
  },[])
  return(
    <Switch>
    
      <Route path="/login">
        <Login/>
      </Route>
      <Route path="/signup">
        <Signup/>
      </Route>
      <Route path="/profile/:userid">
        <UserProfile/>
      </Route>
      <Route  path="/profile">
        <Profile/>
      </Route>
      <Route  path="/create">
        <CreatePost/>
      </Route>
      <Route path="/reset/:token">
        <NewPassword/>
      </Route>
      <Route  path="/reset">
        <Reset/>
      </Route>
      
      
      <Route path="/myfollowerpost">
        <SubPost/>
      </Route>
      <Route path ="/">
        <Home/>
      </Route>
    </Switch>
  )
}


function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <NavBar />
      <Routing />
    </BrowserRouter> 
    </UserContext.Provider>
  );
}

export default App;
