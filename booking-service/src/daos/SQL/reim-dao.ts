import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import {BookingDTOtoBookingConvertor } from "../../utils/BookingDTOConvertor";
import { BookingNotFound } from "../../errors/BookingNotFoundErrors";
import { Bookings } from "../../models/Bookings";
import { BookingInputError } from "../../errors/BookingInputError";

//updated getAllBooking func for booking DONE
//update DB QUERY PENDING
//Promise is representation of a future value of an error
export async function getAllBookings():Promise<Bookings[]>{
    let client: PoolClient;
    try {
        client = await connectionPool.connect()
        let getAllBookingResults:QueryResult = await client.query(`select * from employee_data.reimbursements r
        order by r.date_submitted;`)
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
//UPDATED FUNC NAME, CALLS AND EXPORTS DONE
//UPDATE QUERY PER DB PENDING
export async function findBookingtByStatusId(statusId:number):Promise<Bookings>{
    let client : PoolClient
    try {
        client = await connectionPool.connect()
        let bookByStatusIdResult: QueryResult = await client.query(`select r.reimbursement_id,
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
        where r.status = $1 order by r.date_submitted;`, [statusId])
        if(bookByStatusIdResult.rowCount ===0){
            throw new Error('Reimbursement Not Found')
        }else{
            return BookingDTOtoBookingConvertor(bookByStatusIdResult.rows[0])
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
export async function findBookingByUser(userId:number):Promise<Bookings>{
    let client : PoolClient
    try {
        client = await connectionPool.connect()
        let bookingByUserIdResult: QueryResult = await client.query(`select r.reimbursement_id,
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
        let typeId = await client.query(`select rt.type_id from employee_data.reimbursement_type rt where rt."type" = $1;`, [newBooking.type])
        if(typeId.rowCount === 0){
            throw new Error('Type not found')
        }else {
            typeId = typeId.rows[0].type_id
        }
        
        let results = client.query(`insert into employee_data.reimbursements("author", "amount", "date_submitted", "date_resolved", "description", "resolver", "status", "type") values ($1, $2, $3, $4, $5, $6, $7, $8) returning reimbursement_id`,
        [newBooking.author, newBooking.amount, newBooking.date_submitted, newBooking.date_resolved, newBooking.description, newBooking.resolver, newBooking.status, typeId ])
       
        newBooking.reimbursement_id = (await results).rows[0].reimbursement_id
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
//UPDATED FUNC NAME, CALLS AND EXPORTS DONE
//UPDATE QUERY PER DB PENDING
// Update Booking
export async function updateExistingBooking(updateBooking:Bookings): Promise <Bookings> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        if(updateBooking.amount){
            await client.query(`update employee_data.reimbursements  set "amount" = $1 where "reimbursement_id" = $2;`, [updateBooking.amount, updateBooking.reimbursement_id])
        }
        if(updateBooking.date_resolved){
            await client.query(`update employee_data.reimbursements  set "date_resolved" = $1 where "reimbursement_id" = $2;`, [updateBooking.date_resolved, updateBooking.reimbursement_id])
        }
        if(updateBooking.description){
            await client.query(`update employee_data.reimbursements  set "description" = $1 where "reimbursement_id" = $2;`, [updateBooking.description, updateBooking.reimbursement_id])
        }
        if(updateBooking.resolver){
            await client.query(`update employee_data.reimbursements  set "resolver" = $1 where "reimbursement_id" = $2;`, [updateBooking.resolver, updateBooking.reimbursement_id])
        }
        if(updateBooking.status){
           let status_id =  await client.query(`select rs."status_id" from employee_data.reimbursement_status rs  where rs."status" = $1;`, [updateBooking.status])
            if(status_id.rowCount === 0){
                throw new Error('Status Not Found')
            }

            status_id= status_id.rows[0].status_id
            await client.query(`update employee_data.reimbursements  set "status" = $1 where reimbursement_id = $2;` , [status_id, updateBooking.reimbursement_id])
        }
        if(updateBooking.type){
            let type_id = await client.query(`select rt."type_id" from employee_data.reimbursement_type rt where rt."type" = $1;` , [updateBooking.type])
            if(type_id.rowCount === 0 ){
                throw new Error("Type Not Found")
            }
            type_id= type_id.rows[0].type_id
            await client.query('update employee_data.reimbursements  set "type"= $1 where reimbursement_id = $2;' , [type_id, updateBooking.reimbursement_id])
        }
        
        
        await client.query('COMMIT;') 
        return findBookingById(updateBooking.reimbursement_id)
        
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
//UPDATED FUNC NAME, CALLS AND EXPORTS DONE
//UPDATE QUERY PER DB PENDING
export async function findBookingById(id:number):Promise<Bookings>{
    let client: PoolClient;
    try {
        client = await connectionPool.connect()
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