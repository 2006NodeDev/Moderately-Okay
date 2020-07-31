import React, { FunctionComponent, SyntheticEvent, useState } from 'react'
import { Button, TextField, Container, CssBaseline, Typography, Grid, withStyles, makeStyles } from '@material-ui/core'
import {User} from '../models/User'
import { useParams } from 'react-router'

//This is ripped off of my (Amanda) project 1, we can change the way it looks later

//still need to make the remote file for this component

export const UpdateUserComponent: FunctionComponent<any> = (props) => {
    const classes = useStyles();
    let {userId} = useParams()
    
    //still need to change this
    let [firstName, changeFirstName] = useState("")
    let [lastName, changeLastName] = useState("")
    let [username, changeUsername] = useState("")
    let [password, changePassword] = useState("")
    let [email, changeEmail] = useState("")
    let [image, changeImage] = useState(undefined)



    const updateFirstName = (e:any) => {
        e.preventDefault()
        if (e.currentTarget.value !== undefined){
        changeFirstName(e.currentTarget.value)
        } else{
          changeFirstName(e.currentTarget.firstName)
        }
    }
    const updateLastName = (e:any) => {
        e.preventDefault()
        if (e.currentTarget.value !== undefined){
        changeLastName(e.currentTarget.value)
        } else{
          changeLastName(e.currentTarget.lastName)
        } 
    }
    const updateUsername = (e:any) => {
        e.preventDefault()
        if (e.currentTarget.value !== undefined){
        changeUsername(e.currentTarget.value)
        } else{
          changeUsername(e.currentTarget.username)
        }
    }
    const updatePassword = (e:any) => {
        e.preventDefault()
        if (e.currentTarget.value !== undefined){
        changePassword(e.currentTarget.value)
        } else{
          changePassword(e.currentTarget.password)
        }
    }
    const updateEmail = (e:any) => {
        e.preventDefault()
        if (e.currentTarget.value !== undefined){
        changeEmail(e.currentTarget.value)
        } else{
          changeEmail(e.currentTarget.email)
        }
    }

    const updateImage = (e:any) => {
        let file:File = e.currentTarget.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            console.log(reader.result)
            changeImage(reader.result) //why isn't this working all of a sudden? it worked on my project 1
        }
    }



    const updateUser = async (e: SyntheticEvent) => {
        e.preventDefault()
            let updatedUser:User = {
                userId: userId,
                username,
                password,
                firstName,
                lastName,
                email,
                role: '',
                image
            }
            let res = await dndcharactertrackerUpdateUser(updatedUser)  //change all references to dnd
    }

//we don't have to use this format
    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Update User Profile
          </Typography>
          <form autoComplete="off" onSubmit={updateUser} className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField autoComplete="off"
                  variant="filled"
                  margin="normal"
                  fullWidth
                  id="username"
                  label="New Username"
                  name="username"
                  value={username}
                  onChange={updateUsername}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField autoComplete="off"
                  variant="filled"
                  margin="normal"
                  fullWidth
                  name="password"
                  label="New Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={updatePassword}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField autoComplete="off"
                  variant="filled"
                  fullWidth
                  id="email"
                  label="Change Email"
                  name="email"
                  value={email}
                  onChange={updateEmail}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField autoComplete="off"
                  variant="filled"
                  fullWidth
                  id="firstName"
                  label="Change First Name"
                  name="firstName"
                  value={firstName}
                  onChange={updateFirstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField autoComplete="off"
                  variant="filled"
                  fullWidth
                  id="lastName"
                  label="Change Last Name"
                  name="lastName"
                  value={lastName}
                  onChange={updateLastName}
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="file">Change Profile Picture</label> <br/>
                <input type="file" name="file" accept="image/*" onChange={updateImage} />
                <img src={image} width="100%"/>
              </Grid>
              <Grid item xs={12}>
                <CustomButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                > Update
                </CustomButton>
              </Grid>
            </Grid>            
          </form>
        </div>
      </Container>
    )
}
const CustomButton = withStyles((theme) => ({
  root: {
      color: theme.palette.getContrastText('#ff3333'),
      backgroundColor: "#8B0000",
      '&:hover': {
        backgroundColor: '#8B0000',
      },
  },
}))(Button);


const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      backgroundColor: '#ff3333',
      color: 'white',
      fontSize: 16
    },
    media: {

    }
}));