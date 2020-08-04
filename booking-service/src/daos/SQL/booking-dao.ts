import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import {BookingDTOtoBookingConvertor } from "../../utils/BookingDTOConvertor";
import { BookingNotFound } from "../../errors/BookingNotFoundErrors";
import { Bookings } from "../../models/Bookings";
import { BookingInputError } from "../../errors/BookingInputError";
import { ArtistNotFound } from "../../errors/ArtistNotFoundError";
import { ShopNotFound } from "../../errors/ShopNotFoundError";

const schema = process.env['LB_SCHEMA'] || 'tattoobooking_booking_service'

//updated getAllBooking func for booking  -> DONE
//update DB QUERY -> DONE
//Promise is representation of a future value of an error
export async function getAllBookings():Promise<Bookings[]>{
    let client: PoolClient;
    try {
        client = await connectionPool.connect()
        let getAllBookingResults:QueryResult = await client.query(`select * from tattoobooking_booking_service.bookings b
        order by b.date;`)
        if(getAllBookingResults.rowCount === 0){
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

//It won't give me the customer information, but it does give me everything else. We will have to wait until we have something like jwt or kafka streams
export async function findBookingByCustomer(userId:number):Promise<Bookings>{
    let client : PoolClient
    try {
        client = await connectionPool.connect()
        let bookingByUserIdResult: QueryResult = await client.query(`select b.booking_id, u.first_name, u.last_name, 
        u.user_id, b."style", b."size", b."location", b.image, b.color, b.artist, u.first_name, u.last_name, b.shop , b."date"
        from ${schema}.bookings b 
        left join tattoobooking_user_service.users u 
        on b.customer = u.user_id 
        where b.customer = $1 order by b.date;`, [userId])
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
//UPDATE QUERY PER DB PENDING DONE
export async function submitNewBooking(newBooking: Bookings):Promise<Bookings>{
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        //let typeId = await client.query(`select rt.type_id from tattoobooking_booking_service.reimbursement_type rt where rt."type" = $1;`, [newBooking.type])
        let bookTattoostyle = await client.query(`select s.style_id from tattoobooking_booking_service.styles s where s."style" = $1;`, [newBooking.style])
        if(bookTattoostyle.rowCount === 0){
            throw new Error('Type not found')
        }else {
            bookTattoostyle = bookTattoostyle.rows[0].style_id
        }        
        let results = client.query(`insert into tattoobooking_booking_service.bookings("customer", "style", "size", "location", "image", "color", "artist", "shop", "date") values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning bookings_id`,
        [newBooking.customer, newBooking.style, newBooking.size, newBooking.location,newBooking.imageTest, newBooking.color, newBooking.artist,newBooking.shop,newBooking.date, bookTattoostyle ])
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
        //let typeId = await client.query(`select rt.type_id from tattoobooking_booking_service.reimbursement_type rt where rt."type" = $1;`, [newBooking.type])
        let typeId = await client.query(`select rt.type_id from tattoobooking_booking_service.reimbursement_type rt where rt."type" = $1;`, [newBooking.type])
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
        if(updateBooking.size){
            await client.query(`update tattoobooking_booking_service.bookings  set "size" = $1 where "booking_id" = $2;`, [updateBooking.size, updateBooking.bookingId])
        }
        if(updateBooking.location){
            await client.query(`update tattoobooking_booking_service.bookings  set "location" = $1 where "booking_id" = $2;`, [updateBooking.location, updateBooking.bookingId])
        }
       if(updateBooking.imageTest){
           await client.query(`update tattoobooking_booking_service.bookings  set "image" = $1 where "booking_id" = $2;`, [updateBooking.imageTest, updateBooking.bookingId])
        }
        if(updateBooking.color){
          await client.query(`update tattoobooking_booking_service.bookings  set "color" = $1 where "booking_id" = $2;`, [updateBooking.color, updateBooking.bookingId])
        }
        if(updateBooking.date){
          await client.query(`update tattoobooking_booking_service.bookings  set "date" = $1 where "booking_id" = $2;`, [updateBooking.date, updateBooking.bookingId])
        }
       
        //style
        if(updateBooking.style){
            let style_id = await client.query(`select s."style_id" from tattoobooking_booking_service.styles s where s."type" = $1;` , [updateBooking.style])
         //let status_id =  await client.query(`select rs."status_id" from employee_data.reimbursement_status rs  where rs."status" = $1;`, [updateBooking.status])
            if(style_id.rowCount === 0 ){
                throw new Error("Style Not Found")
            }
            style_id= style_id.rows[0].style_id
            await client.query('update tattoobooking_booking_service.bookings set "style"= $1 where booking_id = $2;' , [style_id, updateBooking.bookingId])
        }
        //artist
                                        //left join tattoobooking_user_services.users u2 on b."artist" = u2.user_id
        if(updateBooking.artist){
            let artist_id = await client.query(`select u."user_id" from tattoobooking_user_services.users u where u."role" = $1;` , [updateBooking.artist])
         //let status_id =  await client.query(`select rs."status_id" from employee_data.reimbursement_status rs  where rs."status" = $1;`, [updateBooking.status])
            if(artist_id.rowCount === 0 ){
                throw new Error("Artist Not Found")
            }
            artist_id = artist_id.rows[0].artist_id
            await client.query('update tattoobooking_booking_service.bookings set "artist"= $1 where booking_id = $2;' , [artist_id, updateBooking.bookingId])
        }   
        //shop
        //                                        left join tattoobooking_booking_service.shop sh on b.shop = sh.shop_id

        if(updateBooking.shop){
            let shop_id = await client.query(`select sh."shop_id" from tattoobooking_booking_service.shops sh where b."shop" = $1;` , [updateBooking.shop])
         //let status_id =  await client.query(`select rs."status_id" from employee_data.reimbursement_status rs  where rs."status" = $1;`, [updateBooking.status])
            if(shop_id.rowCount === 0 ){
                throw new Error("Artist Not Found")
            }
            shop_id = shop_id.rows[0].shop_id
            await client.query('update tattoobooking_booking_service.bookings set "shop"= $1 where booking_id = $2;' , [shop_id, updateBooking.bookingId])
        }           

        await client.query('COMMIT;') 
        return findBookingById(updateBooking.bookingId)
    } catch (error) {
        client && client.query('ROLLBACK;')
        if(error.message === 'Style Not Found'){
            throw new Error ('Style Not Found')
        }else if(error.message === 'Artist Not Found'){
            throw new Error ('Artist Not Found')
        }
        else if(error.message === 'Shop Not Found'){
            throw new Error ('Shop Not Found')
        }
        else if(error.message ===  'Invalid ID'){
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
        let getBookingById:QueryResult = await client.query(`select * from tattoobooking_booking_service.bookings b 
        left join tattoobooking_user_services.users u1 on b.customer = u1.user_id
        left join tattoobooking_booking_service.style s on b.style = s.style_id
        left join tattoobooking_user_services.users u2 on b."artist" = u2.user_id
        left join tattoobooking_booking_service.shop sh on b.shop = sh.shop_id 
        where b.bookings_id = $1 order by b.date;`, [id])
        
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


export async function findBookingByArtistId(userId:number):Promise<Bookings>{
    let client : PoolClient
    try {
        client = await connectionPool.connect()
        //not the best sql code but good enough for now
        let bookingByUserIdResult: QueryResult = await client.query(`select b.booking_id, u.first_name, u.last_name, 
        u.user_id, b."style", b."size", b."location", b.image, 
        b.color, b.artist, b.shop , b."date", b."time" 
        from ${schema}.bookings b 
        left join tattoobooking_user_service.users u on b.artist = u.user_id
        where b.artist = ${userId};`, [userId])
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
        client && client.release()
    }
}

//the sql statement is not the prettiest, but we can limit what gets seen with the ui
//Might be better in User
export async function findArtistByStyle(id:number) {
    let client: PoolClient;
    try{
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`select u.user_id, u.username, u.first_name, u.last_name, 
        u.phone_number, u.email, u."role", 
        as1."style", s.style_name 
        from tattoobooking_user_service.users u 
        left join tattoobooking_booking_service.artist_styles as1 on u.user_id = as1.artist
        left join tattoobooking_booking_service.styles s on as1."style" = s.style_id 
        where as1."style" = ${id};` [id])
        if(results.rowCount === 0){
            throw new Error('NotFound')
        }else{
            return BookingDTOtoBookingConvertor(results.rows[0])
        }
    }catch(e){
        if(e.message === 'NotFound'){
            throw new ArtistNotFound()
        }
        console.log(e)
        throw new Error('Unimplemented error handling')
    }finally{
        client && client.release()
    }
}

export async function findShopByArtist(id:number) {
    let client: PoolClient;
    try{
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`select s.shop_id, s.shop_name, s.street_address, s.city, s.state, 
        s.open_at, s.close_at, s.phone_number, s.email, u.first_name, u.last_name 
        from tattoobooking_booking_service.shops s 
        left join tattoobooking_booking_service.shop_artists sa on s.shop_id = sa.shop
        left join tattoobooking_user_service.users u on sa.artist = u.user_id 
        where sa.artist = ${id};`)
        if(results.rowCount === 0){
            throw new Error('NotFound')
        }else{
            return BookingDTOtoBookingConvertor(results.rows[0])
        }
    }catch(e){
        if(e.message === 'NotFound'){
            throw new ShopNotFound()
        }
        console.log(e)
        throw new Error('Unimplemented error handling')
    }finally{
        client && client.release()
    }
}