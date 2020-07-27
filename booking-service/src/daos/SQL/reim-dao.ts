
import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { ReimDTOtoReimbursementConvertor } from "../../utils/ReimbursementDTOConvertor";
import { ReimbursementNotFound } from "../../errors/ReimbursementNotFoundErrors";
import { Reimbursements } from "../../models/Reimbursements";
import { ReimbursementInputError } from "../../errors/ReimbursementInputError";






//Promise is representation of a future value of an error
export async function getAllReimbursements():Promise<Reimbursements[]>{
    let client: PoolClient;
    try {
        client = await connectionPool.connect()
        let getAllReimResults:QueryResult = await client.query(`select * from employee_data.reimbursements r
        order by r.date_submitted;`)
        if(getAllReimResults.rowCount ===0){
            throw new ReimbursementNotFound();
        }else{
            return getAllReimResults.rows.map(ReimDTOtoReimbursementConvertor)
        }
        
    } catch (error) {
        console.error();
        throw new Error('un implemented error')
    }finally{
        //  && guard operator we are making sure that client is exist then we release
        client && client.release()
    }
}

export async function findReimbursementByStatusId(statusId:number):Promise<Reimbursements>{
    let client : PoolClient
    try {
        client = await connectionPool.connect()
        let reimByStatusIdResult: QueryResult = await client.query(`select r.reimbursement_id,
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
        if(reimByStatusIdResult.rowCount ===0){
            throw new Error('Reimbursement Not Found')
        }else{
            return ReimDTOtoReimbursementConvertor(reimByStatusIdResult.rows[0])
        }
    } catch (error) {
        if(error.message === 'Reimbursement Not Found'){
            throw new ReimbursementNotFound();
        }
        console.log(error)
        throw new Error('un implemented error handling')
    }finally{
        //  && guard operator we are making sure that client is exist then we release
        client && client.release()
    }
}

export async function findReimbursementByUser(userId:number):Promise<Reimbursements>{
    let client : PoolClient
    try {
        client = await connectionPool.connect()
        let reimByUserIdResult: QueryResult = await client.query(`select r.reimbursement_id,
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
        if(reimByUserIdResult.rowCount ===0){
            throw new Error('Reimbursement Not Found')
        }else{
            return ReimDTOtoReimbursementConvertor(reimByUserIdResult.rows[0])
        }
    } catch (error) {
        if(error.message === 'Reimbursement Not Found'){
            throw new ReimbursementNotFound();
        }
        console.log(error)
        throw new Error('un implemented error handling')
    }finally{
        //  && guard operator we are making sure that client is exist then we release
        client && client.release()
    }
}

export async function submitNewReimbursement(newReimbursement: Reimbursements):Promise<Reimbursements>{
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        let typeId = await client.query(`select rt.type_id from employee_data.reimbursement_type rt where rt."type" = $1;`, [newReimbursement.type])
        if(typeId.rowCount === 0){
            throw new Error('Type not found')
        }else {
            typeId = typeId.rows[0].type_id
        }
        
        let results = client.query(`insert into employee_data.reimbursements("author", "amount", "date_submitted", "date_resolved", "description", "resolver", "status", "type") values ($1, $2, $3, $4, $5, $6, $7, $8) returning reimbursement_id`,
        [newReimbursement.author, newReimbursement.amount, newReimbursement.date_submitted, newReimbursement.date_resolved, newReimbursement.description, newReimbursement.resolver, newReimbursement.status, typeId ])
       
        newReimbursement.reimbursement_id = (await results).rows[0].reimbursement_id
        await client.query('COMMIT;')
        return newReimbursement
    } catch (error) {
        client && client.query('ROLLBACK;')
        if(error.message === 'Type not found'){
            throw new ReimbursementInputError();
        }
        console.log(error)
        throw new Error('un implemented error handling')
    }finally{
        client && client.release();
    }
}

// Update Reimbursement
export async function updateExistingReimbursement(updateReim:Reimbursements): Promise <Reimbursements> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        if(updateReim.amount){
            await client.query(`update employee_data.reimbursements  set "amount" = $1 where "reimbursement_id" = $2;`, [updateReim.amount, updateReim.reimbursement_id])
        }
        if(updateReim.date_resolved){
            await client.query(`update employee_data.reimbursements  set "date_resolved" = $1 where "reimbursement_id" = $2;`, [updateReim.date_resolved, updateReim.reimbursement_id])
        }
        if(updateReim.description){
            await client.query(`update employee_data.reimbursements  set "description" = $1 where "reimbursement_id" = $2;`, [updateReim.description, updateReim.reimbursement_id])
        }
        if(updateReim.resolver){
            await client.query(`update employee_data.reimbursements  set "resolver" = $1 where "reimbursement_id" = $2;`, [updateReim.resolver, updateReim.reimbursement_id])
        }
        if(updateReim.status){
           let status_id =  await client.query(`select rs."status_id" from employee_data.reimbursement_status rs  where rs."status" = $1;`, [updateReim.status])
            if(status_id.rowCount === 0){
                throw new Error('Status Not Found')
            }

            status_id= status_id.rows[0].status_id
            await client.query(`update employee_data.reimbursements  set "status" = $1 where reimbursement_id = $2;` , [status_id, updateReim.reimbursement_id])
        }
        if(updateReim.type){
            let type_id = await client.query(`select rt."type_id" from employee_data.reimbursement_type rt where rt."type" = $1;` , [updateReim.type])
            if(type_id.rowCount === 0 ){
                throw new Error("Type Not Found")
            }
            type_id= type_id.rows[0].type_id
            await client.query('update employee_data.reimbursements  set "type"= $1 where reimbursement_id = $2;' , [type_id, updateReim.reimbursement_id])
        }
        
        
        await client.query('COMMIT;') 
        return findReimbursementById(updateReim.reimbursement_id)
        
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

export async function findReimbursementById(id:number):Promise<Reimbursements>{
    let client: PoolClient;
    try {
        client = await connectionPool.connect()
        let getReimbursmentById:QueryResult = await client.query(`select * from employee_data.reimbursements r 
        left join employee_data.users u on r.author = u.user_id 
        left join employee_data.reimbursement_status rs  on r.status = rs.status_id 
        left join employee_data.reimbursement_type rt on rt.type_id = r."type"  
        where r.reimbursement_id = $1 order by r.date_submitted;`, [id])
        
        if(getReimbursmentById.rowCount === 0){
            throw new Error('Reimbursement not found')
        }else{
            // because there will be one object
            return ReimDTOtoReimbursementConvertor(getReimbursmentById.rows[0])
        }
    } catch (error) {
        if(error.message === 'Reimbursement not found'){
            throw new ReimbursementNotFound()
        }
        console.error();
        throw new Error('un implemented error')
    }finally{
        //  && guard operator we are making sure that client is exist then we release
        client && client.release()
    }
}