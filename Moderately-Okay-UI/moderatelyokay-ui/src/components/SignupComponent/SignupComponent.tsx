import React, { FunctionComponent, useState, SyntheticEvent } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { modokaysignup } from '../../remote/moderatelyokay-api/moderatelyokaysignup'
import { User } from '../../models/User'
import { Typography } from '@material-ui/core'
//import classes from '*.module.css'


export const SignUpComponent: FunctionComponent<any> = (props) => {  

  //username and a password 
  let [role, changeRole] = React.useState(2);
  let [username, changeUsername] = useState('')
  let [password, changePassword] = useState('')
  let [firstName, changeFirstname] = useState('')
  let [lastName, changeLastname] = useState('')
  let [phoneNumber, changePhoneNumber] = useState('')
  let [email, changeEmail] = useState('')
  let [birthday, changeBirthday] = useState(new Date())


  const updatePassword = (event: any) => {//get callback for events
    event.preventDefault() //stop default behavior of the event 
    changePassword(event.currentTarget.value)
  }
  const updateUsername = (event: any) => {
    event.preventDefault()
    changeUsername(event.currentTarget.value)
  }
  const updateFirstname = (event: any) => {
    event.preventDefault()  
    changeFirstname(event.currentTarget.value)
  }
  const updateLastname = (event: any) => {
    event.preventDefault()  
    changeLastname(event.currentTarget.value)
  }
  const updateEmail = (event: any) => {
    event.preventDefault()  
    changeEmail(event.currentTarget.value)
  }
  const updatePhoneNumber = (event: any) =>{
    event.preventDefault()
    changePhoneNumber(event.currentTarget.value)
  }
  const updateRole = (event: any) => {
    event.preventDefault()
    changeRole(event.target.value)
  }
  const updateBirthday = (event: any) => {
    event.preventDefault() 
    changeBirthday(event.currentTarget.value)
  }

  const signupSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    let newUser: User = {
      username,
      password,
      firstName,
      lastName,
      birthday,
      phoneNumber,
      email,
      role,
      userId: 0,
    }

    let res = await modokaysignup(newUser)
  }
  const roles = [
    {
        value: '2',
        label: 'Customer',
    },
    {
        value: '3',
        label: 'Artist',
    },
];
  return (

      <form  noValidate autoComplete="off" onSubmit={signupSubmit}>
        <div>
         <br></br>
        <Typography component="h1" variant="h5">
         Sign up
        </Typography>
             <br></br>
        <TextField id="outlined-basic" label="Username" variant="outlined" value={username} onChange={updateUsername} /><br /><br />
        <TextField id="outlined-basic" type="password" label="Password" variant="outlined" value={password} onChange={updatePassword} /><br /><br />
        <TextField id="outlined-basic" label="First Name" variant="outlined" value={firstName} onChange={updateFirstname} /><br /><br />
        <TextField id="outlined-basic" label="Last Name" variant="outlined" value={lastName} onChange={updateLastname} /><br /><br />
        <TextField id="outlined-basic" label="Email" variant="outlined" value={email} onChange={updateEmail} /><br /><br />
        <TextField id="outlined-basic" label="Phone Number" variant="outlined" value={phoneNumber} onChange={updatePhoneNumber} /><br /><br />
        <TextField id="outlined-basic" label="Birthday" type="date" defaultValue="2017-05-24"
             InputLabelProps={{
             shrink: true,
             }}variant="outlined" value={birthday} onChange={updateBirthday} /><br /><br />
        <TextField
                    id="outlined-select-currency-native"
                    select
                    label="Role"
                    value={role}
                    onChange={updateRole}
                    SelectProps={{
                        native: true,
                    }}
                    helperText="Select Role"
                    variant="outlined"
                >
                    {roles.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>       
                <br></br>
                <br></br>
        <Button type="submit" variant="outlined" >Sign Up</Button>
                <br></br>
                <br></br>
                </div>
        </form>

  )
}