import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'

const Profile = () => {
    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")

    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }

        }).then(res=>res.json())
        .then(result=>{
            setPics(result.mypost)
           
        })
    },[])

    useEffect(()=>{
        if(image){
            const data = new FormData()
        // let w=""
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","dhq6gvdfh")
        fetch("https://api.cloudinary.com/v1_1/dhq6gvdfh/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            //  w=data.url
            
            // console.log(data)
            // localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
            // dispatch({type:"UPDATEPIC",payload:data.url})
            fetch('/updatepic',{
                method:"put",
                headers:{
                    "Content-Type" : "application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    pic:data.url
                })
            }).then(res=>res.json())
            .then(result=>{
                console.log(result)
                localStorage.setItem("user",JSON.stringify({...state,pic:data.pic}))
                dispatch({type:"UPDATEPIC",payload:result.pic})
            })
            // window.location.reload()
            // console.log(`w pakad !${url}! !${w}!`)
            
        })
        .catch(err=>{console.log(err)})

        }
    },[image])
    const updatePic = (file)=> {
        setImage(file)
        
    }

    return (
        <div style={{maxWidth:"650px",margin:"0px auto"}}>
            <div style={{
            display:"flex",
            justifyContent:"space-around",
            margin:"20px 0px",
        }}>
            <div>
                <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                src={state?state.pic:"https://res.cloudinary.com/dhq6gvdfh/image/upload/v1608569323/d37suob-77de95c3-0dbe-456a-b15e-413e977a50d0_sfnsam.jpg"}
                />
                
            </div>
            <div style={{color:"white"}}>
                <h4>{state?state.name:"Loading"}</h4>
                <h5>{state?state.email:"Loading"}</h5>
                <div style={{
                    color:"white",
                    display:"flex",
                    justifyContent:"space-between",
                    width:"108%"
                }}>
                    <h6>{mypics.length} posts</h6>
                    <h6>{state?state.followers.length:"0"} followers</h6>
                    <h6>{state?state.following.length:"0"} following</h6>
                </div>
            </div>
        </div>
            <div style={{
            display:"flex",
            flexDirection:"row",
            margin:"20px 0px",
            paddingBottom:"5px",
            paddingLeft:"10%",
            borderBottom:"1px solid grey"
        }}>
            
                <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken">
                    <span>Upload profile pic</span>
                    <input type="file" onChange={(e)=>updatePic(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
                </div>
            </div>
            <div className="gallery">
                {
                    mypics.slice(0).reverse().map(item => {
                        return(
                            <img key={item._id} className="item" src={item.photo} />
                
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile