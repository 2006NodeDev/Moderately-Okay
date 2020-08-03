import express, {Request, Response, NextFunction} from 'express'
import { InvalidIdError } from '../errors/InvalidIdError';
import { Bookings } from '../models/Bookings';
//import { BookingInputError } from '../errors/BookingInputError';
//import { authorizationMiddleWare } from '../middlewares/authorizationMiddleware';
//import { AuthenticationFailure } from '../errors/AuthenticationFailure';
import { getAllBookingsService, UpdateExistingBookingService, findBookingByCustomerService } from '../services/booking-service';
//import { authenticationMiddleware } from '../middlewares/authentication-middleware';


//These need to have Authentication/Authorization.
//We don't need people to look up bookings they're not a part of
//Unless it's admin

//updateBooking

export let bookingRouter = express.Router();

//bookingRouter.use(authenticationMiddleware)

//updated this func to reflect booking DONE
//END POINT NOT WORKING - GETTING SOMETHING WENT WRONG ERROR - BELIEVE IT'S REALTED TO DB AND CODE TYPES NOT MATCHING
bookingRouter.get('/',async (req:Request, res:Response, next:NextFunction)=>{
    //, authorizationMiddleWare(['admin'])
    try {
        let booking = await getAllBookingsService()
        res.json(booking)
    } catch (error) {
        next(error)
    }
})
//updates function name, exports, calls, and variables DONE
// Updated booking fields per db PENDING
//NOT SURE HOW THIS MATCHES 
bookingRouter.get('/customer/:userId', /*authorizationMiddleWare(['admin', 'user']),*/ async(req:Request, res:Response, next:NextFunction)=>{
    let {userId} = req.params
   if(isNaN(+userId)){
        throw new InvalidIdError()
    //} else if(req.session.user.userId !== +userId && req.session.user.role === "user"){
     //   next(new AuthenticationFailure())
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
/*bookingRouter.post('/', async (req:Request, res:Response, next:NextFunction)=>{
    
    let{
        style,
        size,
        location,
        imageTest,
        color,
        artist,
        shop,
        date,
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
            imageTest,
            color,
            artist,
            shop,
            date,
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
            let submitBookingRes = await SubmitNewBookingService(newBooking)
            res.json(submitBookingRes)
        } catch (error) {
            next(error)
        }  
    }
    
})*/

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
        imageTest,
        color,
        shop,
        date,
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
            imageTest,
            color,
            artist: req.session.user.user_id,
            shop,
            date,
            //time
        }
        updatedBooking.customer = customer 
        updatedBooking.style = style 
        updatedBooking.size = size 
        updatedBooking.location = location 
        updatedBooking.imageTest = imageTest 
        updatedBooking.color = color 
        updatedBooking.shop = shop 
        updatedBooking.date = date 
        //updatedBooking.time = time 
        try {
            let updatedBookingResults = await UpdateExistingBookingService(updatedBooking)
            res.json(updatedBookingResults)
        } catch (error) {
            next(error)
        }
 })