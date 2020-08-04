import React, { FunctionComponent, useState, SyntheticEvent } from 'react'
import { Button, TextField, Container, CssBaseline, Typography, Grid, withStyles, makeStyles } from '@material-ui/core'
import { useParams } from 'react-router-dom';
import { Bookings } from '../../models/Bookings';
import { modOkayUpdateBookings } from '../../remote/moderatelyokay-api/moderatelyokayupdatebooking';


//This is ripped off of my (Amanda) project 1, we can change the way it looks and the layout later if we want

export const UpdateBookingComponent: FunctionComponent<any> = (props) => {
    const classes = useStyles();
    let { bookingId } = useParams() //do we want to have userId as another param?
  
    let [style, changeStyle] = useState(0)
    let [size, changeSize] = useState("")
    let [location, changeLocation] = useState("")
    let [imageTest, changeImage] = useState(undefined)
    let [color, changeColor] = useState(false)
    let [shop, changeShop] = useState(0)
    let [date, changeDate] = useState(0)
  
  
  
    const updateStyle = (e: any) => {
      e.preventDefault()
      if (e.currentTarget.value !== undefined) {
        changeStyle(e.currentTarget.value)
      } else {
        changeStyle(e.currentTarget.style)
      }
    }
    const updateSize = (e: any) => {
      e.preventDefault()
      if (e.currentTarget.value !== undefined) {
        changeSize(e.currentTarget.value)
      } else {
        changeSize(e.currentTarget.size)
      }
    }
    const updateLocation = (e: any) => {
      e.preventDefault()
      if (e.currentTarget.value !== undefined) {
        changeLocation(e.currentTarget.value)
      } else {
        changeLocation(e.currentTarget.location)
      }
    }
    const updateImage = (e:any) => {
        let file:File = e.currentTarget.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            console.log(reader.result)
            changeImage(reader.result)
        }
    }
  
    const updateColor = (e: any) => {
      e.preventDefault()
      if (e.currentTarget.value !== undefined) {
        changeColor(e.currentTarget.value)
      } else {
        changeColor(e.currentTarget.color)
      }
    }
    const updateShop = (e: any) => {
      e.preventDefault()
      if (e.currentTarget.value !== undefined) {
        changeShop(e.currentTarget.value)
      } else {
        changeShop(e.currentTarget.shop)
      }
    }
    const updateDate = (e: any) => {
      e.preventDefault()
      if (e.currentTarget.value !== undefined) {
        changeDate(e.currentTarget.value)
      } else {
        changeDate(e.currentTarget.date)
      }
    }
  
  
   //not sure if I did this right. customer and artist may have to be initialized differently
    const updateBooking = async (e: SyntheticEvent) => {
      e.preventDefault()
      let updatedBooking: Bookings = {
        bookingId: bookingId,
        customer: 0,
        style,
        size,
        location,
        imageTest,
        color,
        artist: 0,
        shop,
        date
  
      }
      let res = await modOkayUpdateBookings(updatedBooking) 
    }
  
    //we don't have to use this format
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Update Booking
            </Typography>
          <form autoComplete="off" onSubmit={updateBooking} className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField autoComplete="off"
                  variant="filled"
                  margin="normal"
                  fullWidth
                  id="style"
                  label="New Style"
                  name="style"
                  value={style}
                  onChange={updateStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField autoComplete="off"
                  variant="filled"
                  margin="normal"
                  fullWidth
                  name="size"
                  label="New Size"
                  id="size"
                  value={size}
                  onChange={updateSize}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField autoComplete="off"
                  variant="filled"
                  fullWidth
                  id="location"
                  label="Change Location"
                  name="location"
                  value={location}
                  onChange={updateLocation}
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="file">Change Picture</label> <br/>
                <input type="file" name="file" accept="image/*" onChange={updateImage} />
                <img src={imageTest} width="100%"/>
              </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField autoComplete="off"
                  variant="filled"
                  fullWidth
                  id="color"
                  label="Change Color"
                  name="color"
                  value={color}
                  onChange={updateColor}
                />
                <TextField autoComplete="off" 
                  variant="filled"
                  fullWidth
                  id="shop"
                  label="Change Shop"
                  name="shop"
                  value={shop}
                  onChange={updateShop}
                />
                <TextField autoComplete="off"
                  variant="filled"
                  fullWidth
                  id="date"
                  label="Change Date"
                  name="date"
                  value={date}
                  onChange={updateDate}
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