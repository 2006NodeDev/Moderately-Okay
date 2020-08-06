import React, {FunctionComponent, useState, SyntheticEvent} from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {modokaylogin} from '../../remote/moderatelyokay-api/moderatelyokaylogin'
import { RouteComponentProps } from 'react-router'
import { makeStyles, Theme, createStyles } from '@material-ui/core'

interface ILoginProps extends RouteComponentProps {
    changeCurrentUser: (newUser: any) => void
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: '25ch',
            borderColor:'#240d0d'
        },
        Button: {
            color:'240d0d'
        }
    }),
);

export const LoginComponent:FunctionComponent<ILoginProps> =(props) =>{
    const classes = useStyles();
    //username and a password 

    const[username, changeUsername] = useState('')
    const [password, changePassword] = useState('')

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
        props.changeCurrentUser(res)
        changePassword('')
    }
    return (
        <div>
            <form autoComplete="off" onSubmit={loginSubmit}>
                <TextField
                    id="filled-full-width"
                    label="Username"
                    value={username}
                    onChange={updateUsername}
                    style={{ margin: 8 }}
                    placeholder="Username"
                    helperText="Username"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="filled"
                />
                <br></br>
                <TextField
                    id="filled-full-width"
                    label="Password"
                    type='password'
                    value={password}
                    onChange={updatePassword}
                    style={{ margin: 8 }}
                    placeholder="Password"
                    helperText="Password"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="filled"
                />
                <br></br>
                <Button className={classes.Button} type='submit' variant="contained">Login</Button>
            </form>
        </div>
    )
}