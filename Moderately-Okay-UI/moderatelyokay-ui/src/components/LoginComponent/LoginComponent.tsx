import React, {FunctionComponent, useState, SyntheticEvent} from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {modokaylogin} from '../../remote/moderatelyokay-api/moderatelyokaylogin'

export const LoginComponent:FunctionComponent<any> =(props) =>{
    //username and a password 

    const[username, changeUsername] = useState('')
    const [password, changePassword] = useState('')
    const [currentUser, changeCurrentUser] = useState(null)

    const updatePassword = (event:any)=> {//get callback for events
        event.preventDefault() //stop default behavior of the event 
        changePassword(event.currentTarget.value)
    }
    const updateUsername = (event:any)=> {
        event.preventDefault()
        changeUsername(event.currentTarget.value)
    }
    const loginSubmit = async (e:SyntheticEvent) =>{
        e.preventDefault()
        let res = await modokaylogin(username, password)
        changeCurrentUser(res)
        changePassword('')
    }
    return(
        <div>
            <form autoComplete="off" onSubmit={loginSubmit}>
            <TextField id="outlined-username" label="Username" variant="outlined" value={username} onChange={updateUsername} /><br/><br />
            <TextField id="outlined-pass" type="password" label="Password" variant="outlined" value={password} onChange={updatePassword}/><br /><br />
            <Button type="submit" variant="outlined" color="primary">Login</Button>
            </form>
        </div>
    )
}