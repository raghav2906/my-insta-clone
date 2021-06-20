import React,{useContext, useEffect, useRef, useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const NavBar = ()=> {
  const searchRef=useRef(null)
  const [search,setSearch]=useState('')
  const [searchedUser,setSearchedUser] =useState([])
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  useEffect(()=>{
    M.Modal.init(searchRef.current)
  },[])
  const fetchUser=(query)=>{
    setSearch(query)
    if(query === "")
    return
    
    fetch('/search-users',{
      method:"post",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(result=>{
      // console.log(result)
      setSearchedUser(result.user)
    })
  }
  const renderList = ()=>{
    if(state){
      return [
        <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"white"}}>search</i></li>,
        <li key="2"><Link to="/profile"><span style={{color:"white"}}>Profile</span></Link></li>,
        <li key="3"><Link to="/create"><span style={{color:"white"}}>Create Post</span></Link></li>,
        <li key="4"><Link to="/myfollowerpost"><span style={{color:"white"}}>Sub Post</span></Link></li>,
        <li key="5">
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
        <li key="6"><Link to="/login"><span style={{color:"white"}}>Login</span></Link></li>,
        <li key="7"><Link to="/signup"><span style={{color:"white"}}>Signup</span></Link></li>
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
          <div id="modal1" className="modal card" ref={searchRef} >
            <div className="modal-content">
              <input
                type="text"
                placeholder="Search users"
                value={search}
                onChange={(e)=>fetchUser(e.target.value)}
                />
                <ul className="collection">
                  {searchedUser.map(item=>{
                    return <Link to={item._id!==state._id ?`/profile/${item._id}` : '/profile'}><li className="modal-close collection-item">{item.email}</li></Link>
                    // return <li className="collection-item">{item.email}</li>
                  })}
                  
                </ul>
            </div>
            
              <button style={{marginLeft:"80%"}} className="modal-close waves-effect waves-light btn-small #29b6f6 light-blue lighten-1" onClick={()=>{setSearch('');setSearchedUser([])}}>close</button>
              
          </div>
      </div>
    )
}

export default NavBar