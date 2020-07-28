import express, {Request, Response, NextFunction} from 'express'
import { getAllBookings, findBookingtByStatusId, findBookingByUser, submitNewBooking, updateExistingBooking } from '../daos/SQL/reim-dao';
import { InvalidIdError } from '../errors/InvalidIdError';
import { authenticationMiddleware } from '../middlewares/authentication-middleware';
import { Bookings } from '../models/Bookings';
import { BookingInputError } from '../errors/BookingInputError';
import { authorizationMiddleWare } from '../middlewares/authorizationMiddleware';
import { AuthenticationFailure } from '../errors/AuthenticationFailure';

//updateBooking

export let bookingRouter = express.Router();

bookingRouter.use(authenticationMiddleware)

//updated this func to reflect booking DONE
bookingRouter.get('/', authorizationMiddleWare(['Finance Manager']),async (req:Request, res:Response, next:NextFunction)=>{
    try {
        let booking = await getAllBookings()
        res.json(booking)
    } catch (error) {
        next(error)
    }
    
})


bookingRouter.get('/status/:status_id', authorizationMiddleWare(['Finance Manager']), async(req:Request, res:Response, next:NextFunction)=>{
    let {status_id} = req.params
    if(isNaN(+status_id)){
        throw new InvalidIdError()
    }else{
       try {
            let bookingByStatusId = await findBookingtByStatusId(+status_id)
            res.json(bookingByStatusId)
       } catch (error) {
           next(error)
       }
    }     
})

//updates function name, exports, calls, and variables DONE
// Updated booking fields per db PENDING

bookingRouter.get('/author/userId/:user_id', authorizationMiddleWare(['Finance Manager', 'User']), async(req:Request, res:Response, next:NextFunction)=>{
    let {user_id} = req.params

    if(isNaN(+user_id)){
        throw new InvalidIdError()

    } else if(req.session.user.user_id !== +user_id && req.session.user.role === "User"){
        next(new AuthenticationFailure())
    }else {
       try {
            let bookByUserId = await findBookingByUser(+user_id)
            res.json(bookByUserId)
       } catch (error) {
           next(error)
       }
    }
})

// Submit a reimbursment

bookingRouter.post('/', async (req:Request, res:Response, next:NextFunction)=>{
    
    let{
        amount,
        description,
        type
    } = req.body

    let author = req.session.user.user_id;
    //console.log(author)

    if( !author || !amount || !description  || !type){
        next(new BookingInputError())
    }else{
        let newBooking: Bookings ={
            reimbursement_id: 0,
            author,
            amount,
            date_submitted: new Date(),
            date_resolved: null ,
            description,
            resolver:null,
            status:3,
            type,
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
bookingRouter.patch('/', authorizationMiddleWare(['Finance Manager']), async (req:Request, res:Response, next:NextFunction)=>{
    let{
        reimbursement_id,
        author,
        amount,
        description,
        status,
        type
    } = req.body

    if(!reimbursement_id || isNaN(reimbursement_id)){
        next (new InvalidIdError());
    }
    
        let updatedBooking:Bookings ={
            reimbursement_id,
            author,
            amount,
            date_submitted: new Date(),
            date_resolved: new Date(),
            description,
            resolver: req.session.user.user_id,
            status,
            type
        }
        updatedBooking.author = author 
        updatedBooking.amount = amount 
        updatedBooking.description = description 
        updatedBooking.status = status 
        updatedBooking.type = type 

        try {
            let updatedBookingResults = await updateExistingBooking(updatedBooking)
            res.json(updatedBookingResults)
        } catch (error) {
            next(error)
        }
 })

