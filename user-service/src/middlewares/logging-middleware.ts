import { Response, NextFunction } from "express";

export function loggingMiddleware(req:any,res:Response,next:NextFunction){
    
    console.log(`${req.method} Request from ${req.ip} to ${req.path} `)
    next()
}