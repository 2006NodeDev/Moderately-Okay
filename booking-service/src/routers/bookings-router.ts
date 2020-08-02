import express, {Request, Response, NextFunction} from 'express'
import { getAllBookings, findBookingByUser, submitNewBooking, updateExistingBooking } from '../daos/SQL/booking-dao';
import { InvalidIdError } from '../errors/InvalidIdError';
//import { authenticationMiddleware } from '../middlewares/authentication-middleware';
import { Bookings } from '../models/Bookings';
import { BookingInputError } from '../errors/BookingInputError';
//import { authorizationMiddleWare } from '../middlewares/authorizationMiddleware';
//import { AuthenticationFailure } from '../errors/AuthenticationFailure';
/*
BASIC FUNCTIONALITIES:
1.Submit Booking
2.Update Booking
3.Find Booking by ID
4.Find All Bookings
*/
export let bookingRouter = express.Router();

//bookingRouter.use(authenticationMiddleware)

//updated this func to reflect booking DONE
//END POINT NOT WORKING - GETTING SOMETHING WENT WRONG ERROR - BELIEVE IT'S REALTED TO DB AND CODE TYPES NOT MATCHING
bookingRouter.get('/',async (req:Request, res:Response, next:NextFunction)=>{
    //, authorizationMiddleWare(['admin'])
    try {
        let booking = await getAllBookings()
        res.json(booking)
    } catch (error) {
        next(error)
    }
})
//updates function name, exports, calls, and variables DONE
// Updated booking fields per db PENDING
//NOT SURE HOW THIS MATCHES 
bookingRouter.get('/bookings/bookingId/:booking_id', async(req:Request, res:Response, next:NextFunction)=>{
    //, authorizationMiddleWare(['artist', 'customer']

    let {user_id} = req.params
    //COMMENTED THIS OUT BECAUSE IT'S CONNECTED TO THE USER SERVICE
    //WILL NEED TO MAKE THE CONNECTION
   //if(isNaN(+user_id)){
       // throw new InvalidIdError()
    //} else if(req.session.user.user_id !== +user_id && req.session.user.role === "User"){
     //   next(new AuthenticationFailure())
    // }else {
        try {
            let bookByUserId = await findBookingByUser(+user_id)
            res.json(bookByUserId)
       } catch (error) {
           next(error)
       }
    }

    )
// Submit a reimbursment
bookingRouter.post('/', async (req:Request, res:Response, next:NextFunction)=>{
    
    let{
        style,
        size,
        location,
       // imageTest,
            color,
            artist,
            shop,
            //date,
           // time,
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
           // imageTest,
            color,
            artist,
            shop,
           // date,
           // time
           // reimbursement_id: 0,
            //author,
            //amount,
            //date_submitted: new Date(),
            //date_resolved: null ,
           // description,
            //resolver:null,
            //status:3,
            //type,
        }
        try {
            let submitBooking = await submitNewBooking(newBooking)
            res.json(submitBooking)
        } catch (error) {
            next(error)
        }  
    }
    
})

// Update Booking patch 
//updates function name, exports, calls, and variables DONE
// Updated booking fields per db PENDING
bookingRouter.patch('/', async (req:Request, res:Response, next:NextFunction)=>{
    //, authorizationMiddleWare(['artist'])
    let{
        bookingId,
        customer,
        style,
        size,
        location,
        //imageTest,
        color,
        shop,
        //date,
        //time
        /*
        reimbursement_id,
        author,
        amount,
        description,
        status,
        type
        */
    } = req.body

    if(!bookingId || isNaN(bookingId)){
        next (new InvalidIdError());    }
        let updatedBooking:Bookings ={
            bookingId,
            customer,
            style,
            size,
            location,
            //imageTest,
            color,
            artist: req.session.user.user_id,
            shop,
            //date,
            //time
        }
        updatedBooking.customer = customer 
        updatedBooking.style = style 
        updatedBooking.size = size 
        updatedBooking.location = location 
       // updatedBooking.imageTest = imageTest 
        updatedBooking.color = color 
        updatedBooking.shop = shop 
        //updatedBooking.date = date 
        //updatedBooking.time = time 
        try {
            let updatedBookingResults = await updateExistingBooking(updatedBooking)
            res.json(updatedBookingResults)
        } catch (error) {
            next(error)
        }
 })