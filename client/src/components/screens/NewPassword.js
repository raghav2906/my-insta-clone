import React,{useState,useContext} from 'react'
import '../../App.css'
import {Link,useHistory, useParams} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'


const NewPassword = () => {
    
    const history = useHistory()
    const [password,setPassword] = useState("")
    const [rePassword,setRePassword] = useState("")
    const {token} = useParams()
    console.log(token)
    const PostData = ()=> {
        const a=password
        const b=rePassword
        if(a !== b){
            M.toast({html: "Both password should be same",classes:"#c62828 red darken-3"})
            setPassword("")
            setRePassword("")
            return
        }
        
        fetch("/new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
                history.push('/reset')
            }
            else if(data.err){
                M.toast({html: data.err,classes:"#c62828 red darken-3"})
                history.push('/reset')
            }
            else{
                
                M.toast({html: data.message,classes:"#43a047 green darken-1"})
                history.push('/login')
            }
        }).catch(err=>{console.log(err)})
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h3 className="Tagname">Dada's Instagram</h3>
                
                <input
                type="password"
                placeholder="Enter New-password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <input
                type="password"
                placeholder="Renter New-password"
                value={rePassword}
                onChange={(e)=>setRePassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                onClick={()=>PostData()}
                >
                    Create
                </button>
                
            </div>
      </div>
    )
}

export default NewPassword


