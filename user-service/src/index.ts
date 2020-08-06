import  express, { Request, Response, NextFunction } from 'express';
import { loggingMiddleware } from './middlewares/logging-middleware';
import { getUserByusernameAndPassword } from './daos/SQL/user-dao';
import { corsFilter } from './middlewares/cors-filter';
import {userRouter} from './routers/user-router';
import {InvalidCredentialsError} from  './errors/InvalidCredentialsError';
import jwt from 'jsonwebtoken'
import { JWTVerifyMiddleware } from './middlewares/jwt-verify-middleware';

const app = express();

app.use(express.json({limit:'50mb'}))
app.use(loggingMiddleware)
app.use(corsFilter)

app.use(JWTVerifyMiddleware)
//app.use(authenticationMiddleware) //asks for username and password 
// custom middleware to run on all request

app.use('/users', userRouter)
app.get('/health', (req:Request, res:Response)=>{
    res.sendStatus(200)
})

app.post('/login', async (req:Request, res:Response, next:NextFunction)=>{
    let username = req.body.username
    let password = req.body.password
    if(!username || !password){
        //res.status(401).send('Please enter a valid username and password')
        next (new InvalidCredentialsError())
    }else{
        try {
            let user = await getUserByusernameAndPassword(username, password)
            let token = jwt.sign(user, 'thisIsASecret', {expiresIn: '1h'})
            res.header('Authorization', `Bearer ${token}`)
            res.json(user)
        } catch (error) {
            next(error)
        }
    }
})

app.use((err, req, res, next) =>{
    if(err.statusCode){
        res.status(err.statusCode).send(err.message)
    }else {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
})

app.listen(2006, ()=>{
    console.log('Server has started');
})
