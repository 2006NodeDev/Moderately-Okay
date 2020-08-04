import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import {BookingDTOtoBookingConvertor } from "../../utils/BookingDTOConvertor";
import { BookingNotFound } from "../../errors/BookingNotFoundErrors";
import { Bookings } from "../../models/Bookings";
import { BookingInputError } from "../../errors/BookingInputError";
import { findBookingByBookingIdService } from "../../services/booking-service";

const schema = process.env['LB_SCHEMA'] || 'tattoobooking_booking_service'
//updated getAllBooking func for booking DONE
//update DB QUERY DONE
//Promise is representation of a future value of an error
export async function getAllBookings():Promise<Bookings[]>{
    let client: PoolClient;
    try {
        client = await connectionPool.connect()
        let getAllBookingResults:QueryResult = await client.query(`select * from tattoobooking_booking_service.bookings b
        order by b.date;`)
        if(getAllBookingResults.rowCount ===0){
            throw new BookingNotFound();
        }else{
            return getAllBookingResults.rows.map(BookingDTOtoBookingConvertor)
            //return getAllReimResults.rows.map(ReimDTOtoReimbursementConvertor)
        }        
    } catch (error) {
        console.error();
        throw new Error('unimplemented error')
    }finally{
        //  && guard operator we are making sure that client is exist then we release
        client && client.release()
    }
}
//FIND BY STYLE
//UPDATED FUNC NAME, CALLS AND EXPORTS DONE
//UPDATE QUERY PER DB PENDING -  NEED HELP
export async function findBookingtByStyleId(styleId:number):Promise<Bookings>{
    let client : PoolClient
    try {
        client = await connectionPool.connect()
        let bookByStyleIdResult: QueryResult = await client.query(`select b.booking_id,
        u1.user_id as customer, 
        b.size, 
        b.location, 
        b.date_resolved, 
        b.image,
        b.color,
        b.date, 
        b.time,
        u2.user_id as artist, 
        bs.style_id, 
        bs.style_name, 
        ba.artist, 
        rt.style 
        ${schema}.bookings r
        left join tattoobooking_booking_services.styles rt on r."style" = rt.style
        left join tattoobooking_booking_services.artist_styles rs on r.status = rs.status_id
        left join tattoobooking_booking_services.bookings u1 on r.customer = u1.user_id
        left join tattoobooking_booking_services.artist_styles u2 on r.artist = u2.user_id
        where r.status = $1 order by r.sate;`, [styleId])
        if(bookByStyleIdResult.rowCount ===0){
            throw new Error('Booking Not Found')
        }else{
            return BookingDTOtoBookingConvertor(bookByStyleIdResult.rows[0])
        }
    } catch (error) {
        if(error.message === 'Booking Not Found'){
            throw new BookingNotFound();
        }
        console.log(error)
        throw new Error('Unimplemented error handling')
    }finally{
        //  && guard operator we are making sure that client is exist then we release
        client && client.release()
    }
}
//UPDATED FUNC NAME, CALLS AND EXPORTS DONE
//UPDATE QUERY PER DB - NEED HELP - CLARIFICATION ON THE USER PART
export async function findBookingByUser(userId:number):Promise<Bookings>{
    let client : PoolClient
    try {
        client = await connectionPool.connect()
        let bookingByUserIdResult: QueryResult = await client.query(`select b.booking_id,
        u1.user_id as customer, 
        b.size, 
        b.location, 
        b.image, 
        b.color, 
        b.date, 
        b.time,
        u2.user_id as artist, ??
        bs.style_name, 
        bs.status_id, 
        bsa.shop, 
        bsa.style 
        ${schema}.bookings r
        left join tattoobooking_booking_services.styles rs on r."type" = rt.type_id
        left join tattoobooking_booking_services.reimbursement_status rs on r.status = rs.status_id ???
        left join tattoobooking_booking_services.bookings u1 on r.customer = u1.user_id
        left join tattoobooking_booking_services.artist_styles u2 on r.artist = u2.user_id
        where u1.user_id = $1 order by b.date;`, [userId])
        if(bookingByUserIdResult.rowCount ===0){
            throw new Error('Booking Not Found')
        }else{
            return BookingDTOtoBookingConvertor(bookingByUserIdResult.rows[0])
        }
    } catch (error) {
        if(error.message === 'Booking Not Found'){
            throw new BookingNotFound();
        }
        console.log(error)
        throw new Error('unimplemented error handling')
    }finally{
        //  && guard operator we are making sure that client is exist then we release
        client && client.release()
    }
}


//UPDATED FUNC NAME, CALLS AND EXPORTS DONE
//UPDATE QUERY PER DB PENDING
export async function submitNewBooking(newBooking: Bookings):Promise<Bookings>{
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        //let typeId = await client.query(`select rt.type_id ${schema}.reimbursement_type rt where rt."type" = $1;`, [newBooking.type])
        let bookTattoostyle = await client.query(`select bs.style_id ${schema}.styles bs where bs."style" = $1;`, [newBooking.style])
        //UPDATE TYPE
        if(bookTattoostyle.rowCount === 0){
            throw new Error('Type not found')
        }else {
            bookTattoostyle = bookTattoostyle.rows[0].type_id
        }        
        let results = client.query(`insert into tattoobooking_booking_services.reimbursebookings("customer", "style", "size", "location", "imageTest", "color", "artist", "shop", "date", ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning bookings_id`,
        [newBooking.customer, newBooking.style, newBooking.size, newBooking.location, newBooking.imageTest, newBooking.color, newBooking.artist,newBooking.shop, newBooking.date,  bookTattoostyle ])
        //UPDATE TYPEID       
        newBooking.bookingId = (await results).rows[0].booking_id
        await client.query('COMMIT;')
        return newBooking
    } catch (error) {
        client && client.query('ROLLBACK;')
        if(error.message === 'Style not found'){
            throw new BookingInputError();
        }
        console.log(error)
        throw new Error('Unimplemented error handling')
    }finally{
        client && client.release();
    }
}

 
//UPDATED FUNC NAME, CALLS AND EXPORTS DONE
//UPDATE QUERY PER DB PENDING
// Update Booking
export async function updateExistingBooking(updateBooking:Bookings): Promise <Bookings> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        if(updateBooking.customer){
            await client.query(`update tattoobooking_booking_service.bookings  set "customer" = $1 where "booking_id" = $2;`, [updateBooking.customer, updateBooking.bookingId])
        }
        if(updateBooking.style){
            let style_id = await client.query(`select s."style_id" from tattoobooking_booking_service.styles s where "style" = $1;` , [updateBooking.style])
            if(style_id.rowCount === 0 ){
                throw new Error("Styles Not Found")
            }
            style_id= style_id.rows[0].style_id
            await client.query('update tattoobooking_booking_service.bookings set "style"= $1 where booking_id = $2;' , [style_id, updateBooking.bookingId])
        }    
          
        if(updateBooking.size){
            await client.query(`update tattoobooking_booking_service.bookings  set "size" = $1 where "booking_id" = $2;`, [updateBooking.size, updateBooking.bookingId])
        }
        if(updateBooking.location){
            await client.query(`update tattoobooking_booking_service.bookings  set "location" = $1 where "booking_id" = $2;`, [updateBooking.location, updateBooking.bookingId])
        }
        if(updateBooking.imageTest){
            await client.query(`update tattoobooking_booking_service.bookings  set "imageTest" = $1 where "booking_id" = $2;`, [updateBooking.imageTest, updateBooking.bookingId])
        }if(updateBooking.color){
            await client.query(`update tattoobooking_booking_service.bookings  set "color" = $1 where "booking_id" = $2;`, [updateBooking.color, updateBooking.bookingId])
        }
        // artist 
        if(updateBooking.artist){
            let user_id = await client.query(`select "user_id" from tattoobooking_user_service.users  where "user_id" = $1;` , [updateBooking.artist])
            if(user_id.rowCount === 0 ){
                throw new Error("Artist Not Found")
            }
           user_id=user_id.rows[0].style_id
            await client.query('update tattoobooking_booking_service.bookings set "artis"= $1 where booking_id = $2;' , [user_id, updateBooking.bookingId])
        }

        if(updateBooking.shop){
            let shop_id = await client.query(`select "shop_id" from toobooking_booking_service.shops s where "shop_id" = $1;` , [updateBooking.shop])
            if(shop_id.rowCount === 0 ){
                throw new Error("Shop Not Found")
            }
            shop_id= shop_id.rows[0].style_id
            await client.query('update tattoobooking_booking_service.bookings set "shop"= $1 where booking_id = $2;' , [shop_id, updateBooking.bookingId])
        }
        if(updateBooking.date){
            await client.query(`update tattoobooking_booking_service.bookings  set "date" = $1 where "booking_id" = $2;`, [updateBooking.date, updateBooking.bookingId])
        }
        
        await client.query('COMMIT;') 
        return findBookingByBookingIdService(updateBooking.bookingId)
        
    } catch (error) {
        client && client.query('ROLLBACK;')
        if(error.message === 'Styles Not Found'){
            throw new Error ('Styles Not Found')
        }else if(error.message === 'Artist Not Found'){
            throw new Error ('Artist Not Found')
        }else if(error.message === 'Shop Not Found'){
            throw new Error ('Shop Not Found')
        }else if(error.message ===  'Invalid ID'){
            throw new Error ('Invalid ID')
        }
        console.log(error);
        throw new Error('Unhandled Error')
    }finally {
        client && client.release()
    }
}


//UPDATED FUNC NAME, CALLS AND EXPORTS DONE
//UPDATE QUERY PER DB PENDING
export async function findBookingByBookingId(id:number):Promise<Bookings>{
    let client: PoolClient;
    try {
        client = await connectionPool.connect()
        let getBookingById:QueryResult = await client.query(`select * from tattoobooking_booking_service.bookings b
		left join tattoobooking_user_service.users u on b.customer = u.user_id  
        where b.bookings_id = $1;`, [id])
        
        if(getBookingById.rowCount === 0){
            throw new Error('Booking not found')
        }else{
            // because there will be one object
            return BookingDTOtoBookingConvertor(getBookingById.rows[0])
        }
    } catch (error) {
        if(error.message === 'Booking not found'){
            throw new BookingNotFound()
        }
        console.error();
        throw new Error('Unimplemented error')
    }finally{
        //  && guard operator we are making sure that client is exist then we release
        client && client.release()
    }
}

