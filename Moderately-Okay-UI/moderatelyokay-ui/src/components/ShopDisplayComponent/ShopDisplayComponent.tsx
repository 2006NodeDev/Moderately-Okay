import React, { FunctionComponent } from 'react'
import Typography from '@material-ui/core/Typography'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import { CardContent, Card } from '@material-ui/core';
import { Link, Route } from 'react-router-dom';
import { Shop } from '../../models/Shops';


//I (Amanda) stole this from my project 1, so we can change it however we want

interface IShopDisplayProps {
  shop: Shop
}


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
    card: {
      backgroundColor: 'grey'
    }
  }),
);




export const ShopDisplayComponent: FunctionComponent<IShopDisplayProps> = (props) => {
  let classes = useStyles()
  return (
    <div>
      <Card className={classes.root}>
        <CardContent>
        <Typography variant='body1'>
            Shop ID : {props.shop.shopId}
          </Typography>
          <Typography variant='body1'>
            Shop Name : {props.shop.shopName}
          </Typography>
          <Typography variant='body1'>
            Street Address : {props.shop.streetAddress}
          </Typography>
          <Typography variant='body1'>
            City : {props.shop.city}
          </Typography>
          <Typography variant='body1'>
            State : {props.shop.state}
          </Typography>
          <Typography variant='body1'>
            Phone Number : {props.shop.phoneNumber}
          </Typography>
          <Typography variant='body1'>
            Email : {props.shop.email}
          </Typography>
          <Typography variant='body1'>
            Open at : {props.shop.openAt}
          </Typography>
          <Typography variant='body1'>
            Close at : {props.shop.closeAt}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}