

import { Request, Response, NextFunction } from "express";

/*
user has different roles and their rights are different
all users cannot access all of the functionalities of the application
different permission levels

Employees in the company can 
*login
*submit requests for reimbursement 
*view their past tickets and pending requests. 

Finance managers can 
*log in 
*view 
all reimbursement requests and past history for all employees 
 Finance managers are 
authorized to 
*approve and 
*deny 
requests for expense reimbursement
*/
export function authorizationMiddleWare(roles:string[]){
    return(req:Request, res:Response, next:NextFunction)=>{
        let authorized = false;
        for (const role of roles){
            if(req.session.user.role === role){
                authorized = true;
                next();
            }
        }
        if(!authorized){
            res.status(403).send('You are not authorized to perform this action');
        }
    }
}