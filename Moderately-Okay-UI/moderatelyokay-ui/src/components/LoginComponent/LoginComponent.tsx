import React, { FunctionComponent, useState, SyntheticEvent } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { modokaylogin } from '../../remote/moderatelyokay-api/moderatelyokaylogin'
import { RouteComponentProps } from 'react-router-dom'


//this doesn't have red lines but it throws an error when the website has started


interface ILoginProps extends RouteComponentProps {
    changeCurrentUser: (newUser: any) => void
}

export const LoginComponent: FunctionComponent<ILoginProps> = (props) => {
    //username and a password 

    const [username, changeUsername] = useState('')
    const [password, changePassword] = useState('')

    const updatePassword = (event: any) => {//get callback for events
        event.preventDefault() //stop default behavior of the event 
        changePassword(event.currentTarget.value)
    }
    const updateUsername = (event: any) => {
        event.preventDefault()
        changeUsername(event.currentTarget.value)
    }
    //it doesn't like this and I do not know why
    const loginSubmit = async (e: SyntheticEvent) => {
        e.preventDefault()
        let res = await modokaylogin(username, password)
        props.changeCurrentUser(res)
        changePassword('')

    }
    return (
        <div>
            <form autoComplete="off" onSubmit={loginSubmit}>
                <TextField id="outlined-username" label="Username" variant="outlined" value={username} onChange={updateUsername} /><br /><br />
                <TextField id="outlined-pass" type="password" label="Password" variant="outlined" value={password} onChange={updatePassword} /><br /><br />
                <Button type="submit" variant="outlined" color="primary">Login</Button>
            </form>
        </div>
    )
}