import express, {Request, Response, NextFunction} from 'express'

import { InvalidIdError } from '../errors/InvalidIdError';
import { authenticationMiddleware } from '../middlewares/authentication-middleware';
import { Bookings } from '../models/Bookings';
import { BookingInputError } from '../errors/BookingInputError';
import { authorizationMiddleWare } from '../middlewares/authorizationMiddleware';
import { AuthenticationFailure } from '../errors/AuthenticationFailure';
import { getAllBookingsService, UpdateExistingBookingService, SubmitNewBookingService, findBookingByCustomerService, findShopByArtistService, findBookingByArtistIdService } from '../services/booking-service';


//updateBooking

export let bookingRouter = express.Router();

bookingRouter.use(authenticationMiddleware)

//updated this func to reflect booking DONE
bookingRouter.get('/', authorizationMiddleWare(['admin']),async (req:Request, res:Response, next:NextFunction)=>{
    try {
        let booking = await getAllBookingsService()
        res.json(booking)
    } catch (error) {
        next(error)
    }
    
})

//updates function name, exports, calls, and variables DONE
// Updated booking fields per db PENDING
bookingRouter.get('/customer/:userId', /*authorizationMiddleWare(['admin', 'user']),*/ async(req:Request, res:Response, next:NextFunction)=>{
    let {userId} = req.params
   if(isNaN(+userId)){
        throw new InvalidIdError()
    } else if(req.session.user.userId !== +userId && req.session.user.role === "user"){
        next(new AuthenticationFailure())
     }else {
        try {
            let bookingByUserId = await findBookingByCustomerService(+userId)
            res.json(bookingByUserId)
       } catch (error) {
           next(error)
       }
    }
})

// Submit new booking
bookingRouter.post('/', async (req:Request, res:Response, next:NextFunction)=>{
    
    let{
        style,
        size,
        location,
        imageTest,
            color,
            artist,
            shop,
            date
    } = req.body

    let customer = req.session.user.user_id;
    //console.log(author)
    if( !customer || !style || !size  || !location){
        next(new BookingInputError())
    }else{
        let newBooking: Bookings ={
            bookingId: 0,
            customer,
            style,
            size,
            location,
            imageTest,
            color,
            artist,
            shop,
            date,
        }
        try {
            let submitBookingRes = await SubmitNewBookingService(newBooking)
            res.json(submitBookingRes)
        } catch (error) {
            next(error)
        }  
    }
    
})

// Update Booking patch 
//updates function name, exports, calls, and variables DONE
// Updated booking fields per db PENDING
bookingRouter.patch('/', authorizationMiddleWare(['admin', 'artist', 'customer']), async (req:Request, res:Response, next:NextFunction)=>{
    let{
        bookingId,
        customer,
        style,
        size,
        location,
        imageTest,
        color,
        artist,
        shop,
        date,
       
    } = req.body
    if(!bookingId || isNaN(bookingId)){
        next (new InvalidIdError());    
    }else if(req.session.user.userId !== +customer  && req.session.user.role === "customer" || req.session.user.role === "artist"){
        next(new AuthenticationFailure())
    }else {
        let updatedBooking:Bookings ={
            bookingId,
            customer: req.session.user.user_id,
            style,
            size,
            location,
            imageTest,
            color,
            artist, 
            shop,
            date,
        }
        updatedBooking.customer = customer || undefined
        updatedBooking.style = style || undefined
        updatedBooking.size = size 
        updatedBooking.location = location  || undefined
        updatedBooking.imageTest = imageTest || undefined
        updatedBooking.color = color || undefined
        updatedBooking.artist = artist || undefined
        updatedBooking.shop = shop || undefined
        updatedBooking.date = date || undefined
        
        try {
            let updatedBookingResults = await UpdateExistingBookingService(updatedBooking)
            res.json(updatedBookingResults)
        } catch (error) {
            next(error)
        }
    }
         
 })

  //get booking by Artist

  bookingRouter.get('/artist/:userId', /*authorizationMiddleWare(['admin', 'user']),*/ async(req:Request, res:Response, next:NextFunction)=>{
    let {userId} = req.params
   if(isNaN(+userId)){
        throw new InvalidIdError()
    //} else if(req.session.user.userId !== +userId && req.session.user.role === "user"){
     //   next(new AuthenticationFailure())
     }else {
        try {
            let bookingByUserId = await findBookingByArtistIdService(+userId)
            res.json(bookingByUserId)
       } catch (error) {
           next(error)
       }
    }
})

//get shop by Artist

//is that route clunky? we can change it
bookingRouter.get('/shops/artist/:userId', async(req:Request, res:Response, next:NextFunction)=>{
    let {userId} = req.params
   if(isNaN(+userId)){
        throw new InvalidIdError()
     }else {
        try {
            let bookingByUserId = await findShopByArtistService(+userId)
            res.json(bookingByUserId)
       } catch (error) {
           next(error)
       }
    }
})