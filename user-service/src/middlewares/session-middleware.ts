
import session, { SessionOptions } from 'express-session'

const sessionConfig:SessionOptions = {
    secret: 'secret', // needs to be updated( 'secret'  this is not what we should do in production)
    cookie:{
        secure:false
    },
    resave:false,
    saveUninitialized:false
}

export const sessionMiddleware = session(sessionConfig)
/*
session is factory function
config is the option
it returns a function in the form of (req, res, next)
*/

