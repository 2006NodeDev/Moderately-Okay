import React, { FunctionComponent } from 'react'
import Typography from '@material-ui/core/Typography'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import { CardContent, Card} from '@material-ui/core';
import { Bookings } from '../../models/Bookings';


interface IBookingDisplayProps{
    booking:Bookings
}

//we can change this style + layout later if we want
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      justifyContent: "center",
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(1),
        width: theme.spacing(20),
        height: theme.spacing(17),
      },
    },
    card:{
        backgroundColor:'black'
    },
    text:{
        color:'white'
    }
  }),
);




export const BookingDisplayComponent:FunctionComponent<IBookingDisplayProps> = (props)=>{
    let classes = useStyles()
    return(
      <div>
        <Card className={classes.root}>
            <CardContent>
                <Typography variant='body1'>
                   Booking ID : {props.booking.bookingId}
                </Typography>
                <Typography variant='body1'>
                   Customer : {props.booking.customer}
                </Typography>
                <Typography variant='body1'>
                   Style : {props.booking.style}
                </Typography>
                <Typography variant='body1'>
                   Size : {props.booking.size}
                </Typography>
                <Typography variant='body1'>
                   Location: {props.booking.location}
                </Typography>
                <Typography variant='body1'>
                   Image : {props.booking.imageTest}
                </Typography>
                <Typography variant='body1'>
                   Color : {props.booking.color}
                </Typography>
                <Typography variant='body1'>
                   Artist : {props.booking.artist}
                </Typography>
                <Typography variant='body1'>
                   Shop : {props.booking.shop}
                </Typography>
                <Typography variant='body1'>
                   Date : {props.booking.date}
                </Typography>
                <Button variant='contained' color='inherit'>Edit</Button>
            </CardContent>
        </Card>
      </div>
    )
}