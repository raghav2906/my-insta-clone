import React,{useContext, useEffect, useState} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

const Home = () => {
    const [data,setData] = useState([])
    const [image,setImage] = useState("")
    const [postId,setPostId] = useState("")
    // const [url,setUrl] = useState("")
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
        fetch('/allpost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>{
            // console.log(res) 
            return res.json()})
        .then(result=>{
            // console.log(result)
            setData(result.posts)
        })
    },[])

    useEffect(()=>{
        if(image){
            const ndata = new FormData()
        // let w=""
        ndata.append("file",image)
        ndata.append("upload_preset","insta-clone")
        ndata.append("cloud_name","dhq6gvdfh")
        fetch("https://api.cloudinary.com/v1_1/dhq6gvdfh/image/upload",{
            method:"post",
            body:ndata
        })
        .then(res=>res.json())
        .then(idata=>{
            console.log(idata.url)
            fetch(`/updatepost/${postId}`,{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    pic:idata.url
                })
            }).then(res=>res.json())
            .then(result =>{
                console.log(result)
                const duplicate = data.map((item)=>{
                    if(item._id === postId){
                        return {
                            ...item,
                            photo:idata.url
                        }
                    }
                    else{
                        return item
                    }
                })
                setData(duplicate)
            })
        })
        .catch(err=>{console.log(err)})

        }
    },[image])

    const likePost = (id) =>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{console.log(err)})
    }

    const unlikePost = (id) =>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{console.log(err)})
    }

    const makeComment = (text,postId) => {
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:postId,
                text:text
            })
        }).then(res=>res.json())
        .then(result => {
            console.log(result)
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
                
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }

    const deleteComment = (postId,commentId) => {
        fetch(`/deletecomment/${postId}/${commentId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
                
            })
            setData(newData)
        }).catch(err=>{console.log(err)})
    }

    const updatePost = (file,post_Id) =>{
        setPostId(post_Id)
        setImage(file)
    }

    return (
        <div className="home">
            {
                data.slice(0).reverse().map(item=>{
                    return(
                        <div className="card home-card">
                            <h5><Link to={item.postedBy._id !== state._id ? `/profile/${item.postedBy._id}` : '/profile'}><span><img style={{width:"5%",height:"5%",marginLeft:"6px",marginTop:"6px",borderRadius:"50%"}} src={item.postedBy.pic} /></span><span  style={{color:"white",padding:"10px"}}>{item.postedBy.name}</span></Link> {item.postedBy._id === state._id 
                                && <i className="material-icons" style={{float:"right"}} 
                                onClick={()=>deletePost(item._id)} >
                                delete</i> 
                                }</h5>
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                            {item.postedBy._id === state._id 
                            &&    <div className="file-field input-field">
                                <div className="btn #64b5f6 blue darken">
                                    <span>Update post</span>
                                    <input type="file" onChange={(e)=>updatePost(e.target.files[0],item._id)} />
                                </div>
                                <div className="file-path-wrapper">
                                    <input className="file-path validate" type="text"/>
                                </div>
                                </div>
                            }
                            <i className="material-icons">favorite_border</i>
                            {item.likes.includes(state._id)
                            ?
                                <i className="material-icons"
                                onClick={()=>{unlikePost(item._id)}}
                                >thumb_down</i>
                            :
                                <i className="material-icons"
                                onClick={()=>{likePost(item._id)}}
                                >thumb_up</i>
                            }
                            
                            
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record=>{
                                        return(
                                        <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}
                                        
                                        {item.postedBy._id === state._id 
                                        && <i className="material-icons" style={{float:"right"}} 
                                        onClick={()=>deleteComment(item._id,record._id)} >
                                        delete</i> 
                                        }
                                        </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                }}>
                                    <input type="text" placeholder="Add a comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
            
           
        </div>
        
    )
}

export default Home