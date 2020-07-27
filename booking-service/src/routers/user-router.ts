import express, { Request, Response, NextFunction } from 'express'
import { authorizationMiddleWare } from '../middlewares/authorizationMiddleware';
import { Users } from '../models/Users';
import { InvalidIdError } from '../errors/InvalidIdError';
import { AuthenticationFailure } from '../errors/AuthenticationFailure';
import { authenticationMiddleware } from '../middlewares/authentication-middleware';
import { getAllUsersService, findUserByIdService, UpdateOnExistingUserService, SubmitNewUserService, } from '../services/user-service';
import { UserMissingInputError } from '../errors/UserMissingInputError';


export let userRouter = express.Router();

userRouter.use(authenticationMiddleware)

userRouter.get('/', authorizationMiddleWare(['Finance Manager', 'Admin']), async (req:Request, res:Response, next:NextFunction)=>{
    try {
        let getAllusers = await getAllUsersService()
        res.json(getAllusers)
    } catch (error) {
        next(error)
    }
})

userRouter.get('/:id', authorizationMiddleWare(['Finance Manager', 'Admin' ,'User']), async (req:Request, res:Response, next:NextFunction) =>{
    let {id} = req.params
    if(isNaN(+id)){
        res.status(400).send('Id must be a number')
    }else if(req.session.user.user_id !== +id && req.session.user.role === "User"){
        next(new AuthenticationFailure())
    }
    else {
        try {
            let userById = await findUserByIdService(+id)
            res.json(userById)
        } catch (error) {
            next(error)
        }
    }
})

// Update User / Allowed Admin // For Project 1 user can also update his/her own info

userRouter.patch('/', authorizationMiddleWare(['Admin', 'User']), async (req:Request, res:Response, next:NextFunction)=>{
    
        let{
        user_id,
        username,
        password,
        first_name,
        last_name,
        email,
        role,
        image
        } = req.body

        if(!user_id || isNaN(req.body.user_id)){
            next(new InvalidIdError())
            
        }else if(req.session.user.user_id !== +user_id  && req.session.user.role === "User"){
            next(new AuthenticationFailure())
        }else { 
        let updatedUser: Users = {
            user_id,
            username, 
            password, 
            first_name,
            last_name,
            email,
            role,
            image
        }
        updatedUser.username= username ||undefined
        updatedUser.password = password || undefined
        updatedUser.first_name = first_name || undefined
        updatedUser.last_name = last_name || undefined
        updatedUser.email = email || undefined
        updatedUser.role = role || undefined
        updatedUser.image = image || undefined

        console.log(updatedUser)
        try {
            let updateResults = await UpdateOnExistingUserService(updatedUser)
            res.json(updateResults)
        } catch (error) {
            next(error)
        }
    }
})



userRouter.post('/',  async (req: Request, res: Response, next: NextFunction) => {
    // get input from the user
    let { first_name, last_name, username, password, email, role, image } = req.body//a little old fashioned destructuring
    //verify that input
    if (!first_name || !last_name || !username || !password || !role) {
        next(new UserMissingInputError)
    } else {
        //try  with a function call to the dao layer to try and save the user
        let newUser: Users = {
            first_name,
            last_name,
            username,
            password,
            role,
            user_id:0,
            email,
            image,
        }
        newUser.email = email || null
        try {
            let savedUser = await SubmitNewUserService(newUser)
            res.json(savedUser)// needs to have the updated userId
        } catch (e) {
            next(e)
        }
    }
})



