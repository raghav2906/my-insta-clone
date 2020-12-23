import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'

const NavBar = ()=> {
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  const renderList = ()=>{
    if(state){
      return [
        <li><Link to="/profile"><span style={{color:"white"}}>Profile</span></Link></li>,
        <li><Link to="/create"><span style={{color:"white"}}>Create Post</span></Link></li>,
        <li><Link to="/myfollowerpost"><span style={{color:"white"}}>Sub Post</span></Link></li>,
        <li>
          <button className="btn #c62828 red darken-3"
          onClick={()=>{
            localStorage.clear()
            dispatch({type:"CLEAR"})
            history.push('/login')
          }}
          >
            Logout
          </button>
        </li>
      ]
    }
    else{
      return [
        <li><Link to="/login"><span style={{color:"white"}}>Login</span></Link></li>,
        <li><Link to="/signup"><span style={{color:"white"}}>Signup</span></Link></li>
      ]
    }
  }
    return(
      <div className="navbar-fixed">
        <nav>
    <div className="nav-wrapper black">
      <Link to={state?"/":"/login"} className="brand-logo left"><i className="fa fa-instagram" aria-hidden="true"></i>Dada's Instagram</Link>
      <ul id="nav-mobile" className="right">
        {renderList()}
      </ul>
    </div>
  </nav>
  </div>
    )
}

export default NavBar