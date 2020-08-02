import React, { FunctionComponent, SyntheticEvent, useState } from 'react'
import { Button, TextField, Container, CssBaseline, Typography, Grid, withStyles, makeStyles } from '@material-ui/core'
import { User } from '../../models/User'
import { useParams } from 'react-router'
import { modOkayUpdateUser } from '../../remote/moderatelyokay-api/moderatelyokayupdateuser'

//This is ripped off of my (Amanda) project 1, we can change the way it looks and the layout later if we want


export const UpdateUserComponent: FunctionComponent<any> = (props) => {
  const classes = useStyles();
  let { userId } = useParams()

  let [username, changeUsername] = useState("")
  let [password, changePassword] = useState("")
  let [firstName, changeFirstName] = useState("")
  let [lastName, changeLastName] = useState("")
  let [birthday, changeBirthday] = useState("")
  let [phoneNumber, changePhoneNumber] = useState("")
  let [email, changeEmail] = useState("")



  const updateUsername = (e: any) => {
    e.preventDefault()
    if (e.currentTarget.value !== undefined) {
      changeUsername(e.currentTarget.value)
    } else {
      changeUsername(e.currentTarget.username)
    }
  }
  const updatePassword = (e: any) => {
    e.preventDefault()
    if (e.currentTarget.value !== undefined) {
      changePassword(e.currentTarget.value)
    } else {
      changePassword(e.currentTarget.password)
    }
  }
  const updateFirstName = (e: any) => {
    e.preventDefault()
    if (e.currentTarget.value !== undefined) {
      changeFirstName(e.currentTarget.value)
    } else {
      changeFirstName(e.currentTarget.firstName)
    }
  }
  const updateLastName = (e: any) => {
    e.preventDefault()
    if (e.currentTarget.value !== undefined) {
      changeLastName(e.currentTarget.value)
    } else {
      changeLastName(e.currentTarget.lastName)
    }
  }

  const updateBirthday = (e: any) => {
    e.preventDefault()
    if (e.currentTarget.value !== undefined) {
      changeBirthday(e.currentTarget.value)
    } else {
      changeBirthday(e.currentTarget.birthday)
    }
  }
  const updatePhoneNumber = (e: any) => {
    e.preventDefault()
    if (e.currentTarget.value !== undefined) {
      changePhoneNumber(e.currentTarget.value)
    } else {
      changePhoneNumber(e.currentTarget.phoneNumber)
    }
  }
  const updateEmail = (e: any) => {
    e.preventDefault()
    if (e.currentTarget.value !== undefined) {
      changeEmail(e.currentTarget.value)
    } else {
      changeEmail(e.currentTarget.email)
    }
  }


 
  const updateUser = async (e: SyntheticEvent) => {
    e.preventDefault()
    let updatedUser: User = {
      userId: userId,
      username,
      password,
      firstName,
      lastName,
      birthday: new Date,
      phoneNumber,
      email,
      role: '',

    }
    let res = await modOkayUpdateUser(updatedUser) 
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
              <TextField autoComplete="off" //Might want to change this to reflect the same layout as signup
                variant="filled"
                fullWidth
                id="birthday"
                label="Change Birthday"
                name="birthday"
                value={birthday}
                onChange={updateBirthday}
              />
              <TextField autoComplete="off"
                variant="filled"
                fullWidth
                id="phoneNumber"
                label="Change Phone Number"
                name="phoneNumber"
                value={phoneNumber}
                onChange={updatePhoneNumber}
              />
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