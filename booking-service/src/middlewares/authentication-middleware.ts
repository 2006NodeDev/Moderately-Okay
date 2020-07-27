import { Request, NextFunction, Response } from "express";

export function authenticationMiddleware(req:Request, res:Response, next:NextFunction){
    if(!req.session.user){
        res.status(401).send('Please login')
    }else {
        console.log(`user ${req.session.user.username} has a role of ${req.session.user.role}`);
        next()
    }

}