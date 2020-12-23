import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

const Profile = () => {
    const [userProfile,setProfile] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showfollow,setShowFollow] = useState(state.followers.includes(userid))
    console.log(userid)
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }

        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
 
            setProfile(result)
        })
    },[])

    const followUser = () => {
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            dispatch({type:"UPDATE",payload:{followers:result.followers,following:result.following}})
            localStorage.setItem("user",JSON.stringify(result))
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,result._id]
                    }
                }

            })
            setShowFollow(false)
        })
    }

    const unfollowUser = () => {
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            dispatch({type:"UPDATE",payload:{followers:result.followers,following:result.following}})
            localStorage.setItem("user",JSON.stringify(result))
            setProfile((prevState)=>{
                const duplicate = prevState.user.followers.filter((item)=>{
                    if (item != result._id)
                    return item
                })
                if(duplicate === undefined){
                    duplicate=[]
                }
                console.log(duplicate)
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:duplicate
                    }
                }

            })
            setShowFollow(true)
        })
    }

    return (
        <>
        {userProfile ? 
        
        <div style={{maxWidth:"650px",margin:"0px auto"}}>
            <div style={{
            display:"flex",
            justifyContent:"space-around",
            margin:"20px 0px",
            borderBottom:"1px solid grey"
        }}>
            <div>
                <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                src={userProfile.user.pic}
                />
            </div>
            <div style={{color:"white"}}>
                <h5>{userProfile.user.name}</h5>
                <h5>{userProfile.user.email}</h5>
                
                <div style={{
                    display:"flex",
                    justifyContent:"space-between",
                    width:"108%"
                }}>
                    <h6>{userProfile.posts.length} posts</h6>
                    <h6>{userProfile.user.followers.length} followers</h6>
                    <h6>{userProfile.user.following.length} following</h6>
                </div>
                {showfollow ?
                <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                onClick={()=>followUser()}
                >
                    Follow
                </button>:
                 <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                 onClick={()=>unfollowUser()}
                 >
                     UnFollow
                 </button>

                }
                
            </div>
        </div>
            
            <div className="gallery">
                {
                    userProfile.posts.map(item => {
                        return(
                            <img key={item._id} className="item" src={item.photo} />
                
                        )
                    })
                }
            </div>
        </div>
        
        
        : <h2>Loading...!</h2>}
        
        </>
    )
}

export default Profile