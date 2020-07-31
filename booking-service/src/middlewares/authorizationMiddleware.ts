

import { Request, Response, NextFunction } from "express";


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