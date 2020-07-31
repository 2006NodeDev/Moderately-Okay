import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import {BookingDTOtoBookingConvertor } from "../../utils/BookingDTOConvertor";
import { BookingNotFound } from "../../errors/BookingNotFoundErrors";
import { Bookings } from "../../models/Bookings";
import { BookingInputError } from "../../errors/BookingInputError";

const schema = process.env['LB_SCHEMA'] || 'tattoobooking_booking_service'
//updated getAllBooking func for booking DONE
//update DB QUERY DONE
//Promise is representation of a future value of an error
export async function getAllBookings():Promise<Bookings[]>{
    let client: PoolClient;
    try {
        client = await connectionPool.connect()
        let getAllBookingResults:QueryResult = await client.query(`select * ${schema}.bookings b
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
/*
(`select r.booking_id,
        u1.user_id as author, 
        r.amount, 
        r.date_submitted, 
        r.date_resolved, 
        r.description, 
        u2.user_id as resolver, 
        rs.status, 
        rs.status_id, 
        rt."type", 
        rt.type_id 
        from employee_data.reimbursements r
        left join employee_data.reimbursement_type rt on r."type" = rt.type_id
        left join employee_data.reimbursement_status rs on r.status = rs.status_id
        left join employee_data.users u1 on r.author = u1.user_id
        left join employee_data.users u2 on r.resolver = u2.user_id
        where u1.user_id = $1 order by r.date_submitted;`, [userId])

*/

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
        let results = client.query(`insert into tattoobooking_booking_services.reimbursebookings("customer", "style", "size", "location", "imageTest", "color", "artist", "shop", "date", "time") values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning bookings_id`,
        [newBooking.customer, newBooking.style, newBooking.size, newBooking.location, newBooking.imageTest, newBooking.color, newBooking.artist,newBooking.shop, newBooking.date, newBooking.time, bookTattoostyle ])
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
/*
let client: PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        //let typeId = await client.query(`select rt.type_id ${schema}.reimbursement_type rt where rt."type" = $1;`, [newBooking.type])
        let typeId = await client.query(`select rt.type_id ${schema}.reimbursement_type rt where rt."type" = $1;`, [newBooking.type])
        //UPDATE TYPE
        if(typeId.rowCount === 0){
            throw new Error('Type not found')
        }else {
            typeId = typeId.rows[0].type_id
        }
        
        let results = client.query(`insert into employee_data.reimbursements("author", "amount", "date_submitted", "date_resolved", "description", "resolver", "status", "type") values ($1, $2, $3, $4, $5, $6, $7, $8) returning reimbursement_id`,
        [newBooking.customer, newBooking.style, newBooking.size, newBooking.location, newBooking.imageTest, newBooking.color, newBooking.artist,newBooking.shop, newBooking.date, newBooking.time, typeId ])
        //UPDATE TYPEID       
        newBooking.bookingId = (await results).rows[0].reimbursement_id
        await client.query('COMMIT;')
        return newBooking
    } catch (error) {
        client && client.query('ROLLBACK;')
        if(error.message === 'Type not found'){
            throw new BookingInputError();
        }
        console.log(error)
        throw new Error('unimplemented error handling')
    }finally{
        client && client.release();
    }
}
*/

//UPDATED FUNC NAME, CALLS AND EXPORTS DONE
//UPDATE QUERY PER DB PENDING
// Update Booking
export async function updateExistingBooking(updateBooking:Bookings): Promise <Bookings> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        if(updateBooking.style){
            await client.query(`update tattoobooking_booking_services.bookings  set "size" = $1 where "booking_id" = $2;`, [updateBooking.size, updateBooking.bookingId])
        }
        if(updateBooking.size){
            await client.query(`update tattoobooking_booking_services.bookings  set "location" = $1 where "booking_id" = $2;`, [updateBooking.location, updateBooking.bookingId])
        }
        if(updateBooking.location){
            await client.query(`update tattoobooking_booking_services.bookings  set "imageTest" = $1 where "booking_id" = $2;`, [updateBooking.imageTest, updateBooking.bookingId])
        }
        if(updateBooking.imageTest){
            await client.query(`update tattoobooking_booking_services.bookings  set "color" = $1 where "booking_id" = $2;`, [updateBooking.color, updateBooking.bookingId])
        }
        if(updateBooking.style){
            let style_id = await client.query(`select bs."style_id" ${schema}.styles bs where bs."type" = $1;` , [updateBooking.style])
            if(style_id.rowCount === 0 ){
                throw new Error("Type Not Found")
            }
            style_id= style_id.rows[0].style_id
            await client.query('update tattoobooking_booking_services.bookings set "type"= $1 where booking_id = $2;' , [style_id, updateBooking.bookingId])
        }      
        
        await client.query('COMMIT;') 
        return findBookingById(updateBooking.bookingId)
        
    } catch (error) {
        client && client.query('ROLLBACK;')
        if(error.message === 'Status Not Found'){
            throw new Error ('Status Not Found')
        }else if(error.message === 'Type Not Found'){
            throw new Error ('Type Not Found')
        }else if(error.message ===  'Invalid ID'){
            throw new Error ('Invalid ID')
        }
        console.log(error);
        throw new Error('Unhandled Error')
    }finally {
        client && client.release()
    }
}
/*
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        if(updateBooking.style){
            await client.query(`update employee_data.reimbursements  set "amount" = $1 where "reimbursement_id" = $2;`, [updateBooking.amount, updateBooking.bookingId])
        }
        if(updateBooking.size){
            await client.query(`update employee_data.reimbursements  set "date_resolved" = $1 where "reimbursement_id" = $2;`, [updateBooking.date, updateBooking.bookingId])
        }
        if(updateBooking.location){
            await client.query(`update employee_data.reimbursements  set "description" = $1 where "reimbursement_id" = $2;`, [updateBooking.description, updateBooking.bookingId])
        }
        if(updateBooking.imageTest){
            await client.query(`update employee_data.reimbursements  set "resolver" = $1 where "reimbursement_id" = $2;`, [updateBooking.resolver, updateBooking.bookingId])
        }
        if(updateBooking.status){
           let status_id =  await client.query(`select rs."status_id" from employee_data.reimbursement_status rs  where rs."status" = $1;`, [updateBooking.status])
            if(status_id.rowCount === 0){
                throw new Error('Status Not Found')
            }

            status_id= status_id.rows[0].status_id
            await client.query(`update employee_data.reimbursements  set "status" = $1 where reimbursement_id = $2;` , [status_id, updateBooking.bookingId])
        }
        if(updateBooking.type){
            let type_id = await client.query(`select rt."type_id" from employee_data.reimbursement_type rt where rt."type" = $1;` , [updateBooking.type])
            if(type_id.rowCount === 0 ){
                throw new Error("Type Not Found")
            }
            type_id= type_id.rows[0].type_id
            await client.query('update employee_data.reimbursements  set "type"= $1 where reimbursement_id = $2;' , [type_id, updateBooking.bookingId])
        }      
        
        await client.query('COMMIT;') 
        return findBookingById(updateBooking.bookingId)
        
    } catch (error) {
        client && client.query('ROLLBACK;')
        if(error.message === 'Status Not Found'){
            throw new Error ('Status Not Found')
        }else if(error.message === 'Type Not Found'){
            throw new Error ('Type Not Found')
        }else if(error.message ===  'Invalid ID'){
            throw new Error ('Invalid ID')
        }
        console.log(error);
        throw new Error('Unhandled Error')
    }finally {
        client && client.release()
    }
}

*/




//UPDATED FUNC NAME, CALLS AND EXPORTS DONE
//UPDATE QUERY PER DB PENDING
export async function findBookingById(id:number):Promise<Bookings>{
    let client: PoolClient;
    try {
        client = await connectionPool.connect()
        let getBookingById:QueryResult = await client.query(`select * ${schema}.bookings b 
        left join tattoobooking_booking_services.users u on r.customer = u.user_id  ???
        left join tattoobooking_booking_services.reimbursement_type bs on bs.style_id = b."style"  
        where b.bookings_id = $1 order by b.date;`, [id])
        
        if(getBookingById.rowCount === 0){
            throw new Error('Reimbursement not found')
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


/*
 let getBookingById:QueryResult = await client.query(`select * from employee_data.reimbursements r 
        left join employee_data.users u on r.author = u.user_id 
        left join employee_data.reimbursement_status rs  on r.status = rs.status_id 
        left join employee_data.reimbursement_type rt on rt.type_id = r."type"  
        where r.reimbursement_id = $1 order by r.date_submitted;`, [id])
        
        if(getBookingById.rowCount === 0){
            throw new Error('Reimbursement not found')
        }else{
            // because there will be one object
            return BookingDTOtoBookingConvertor(getBookingById.rows[0])
        }
    } catch (error) {
        if(error.message === 'Booking not found'){
            throw new BookingNotFound()
        }
        console.error();
        throw new Error('unimplemented error')
    }finally{
        //  && guard operator we are making sure that client is exist then we release
        client && client.release()
    }
}


*/