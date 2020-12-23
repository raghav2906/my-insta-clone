import React,{useState,useEffect} from 'react'
import M from 'materialize-css'
import {useHistory} from 'react-router-dom'

//dhq6gvdfh

const CreatePost = ()=>{
    const history = useHistory()
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    useEffect(()=>{
        if(url){
        fetch("/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(localStorage.getItem("jwt"),data)
            if(data.err){
                M.toast({html: data.err,classes:"#c62828 red darken-3"})
            }
            else if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html: "Created post successfully",classes:"#43a047 green darken-1"})
                history.push('/')
            }
        }).catch(err=>{console.log(err)})
    }
    },[url])

    const postDetails = () => {
        const data = new FormData()
        let w=""
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","dhq6gvdfh")
        fetch("https://api.cloudinary.com/v1_1/dhq6gvdfh/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
             w=data.url
            setUrl(data.url)
            console.log(`w pakad !${url}! !${w}!`)
            
        })
        .catch(err=>{console.log(err)})

        
    }

    return(
        <div className="card input-filed"
        style={{
            margin:"10px auto",
            maxWidth:"500px",
            padding:"20px",
            textAlign:"center"
        }}
        >
             <h2 className="Tagname">Dada's Instagram</h2>
            <input 
                type="text"
                placeholder="title" 
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
            />
            <input 
                type="text" 
                placeholder="body" 
                value={body}
                onChange={(e)=>setBody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken"
                onClick={()=>postDetails()}
            >
                    Create Post
                </button>
        </div>
    )
}

export default CreatePost