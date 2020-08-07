import React, {FunctionComponent, useState, SyntheticEvent} from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {modokaylogin} from '../../remote/moderatelyokay-api/moderatelyokaylogin'
import { RouteComponentProps } from 'react-router'
import { makeStyles, Theme, createStyles, Container, CssBaseline, Typography, Grid, Link, Avatar } from '@material-ui/core'
//import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

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
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            color:'240d0d',
        },
        Link: {
            marginLeft: theme.spacing(11),
            marginRight: theme.spacing(11),
            alignItems: 'center',
        },
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          },
          avatar: {
            marginLeft: theme.spacing(22),
            marginRight: theme.spacing(22),
            margin: theme.spacing(1),
            alignItems: 'center',
            backgroundColor: theme.palette.primary.dark,
          },
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
        props.history.push(`/profile/${res.userId}`)

    }
    const preventDefault = (e:SyntheticEvent)=>{
        e.preventDefault()
          props.history.push(`/signup`)
      }
    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div> 
            <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
             </Avatar>
            <Typography component="h1" variant="h5">
             Sign in
            </Typography>
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
                <Button fullWidth className={classes.Button} type='submit' variant="contained">Login</Button>   
         
            <Grid container>
            <Grid item>
              <br></br>
              <Link className={classes.Link} onClick={preventDefault} href="/signup" variant="body2">
              {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
            </Grid>
            </form>
        </div>
        </Container>
    )
}