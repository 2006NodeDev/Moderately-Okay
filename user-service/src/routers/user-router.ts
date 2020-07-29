import express, { Request, Response, NextFunction } from 'express'
import { authorizationMiddleWare } from '../middlewares/authorizationMiddleware';
import { Users } from '../models/Users';
import { InvalidIdError } from '../errors/InvalidIdError';
import { AuthenticationFailure } from '../errors/AuthenticationFailure';
import { authenticationMiddleware } from '../middlewares/authentication-middleware';
import { getAllUsersService, findUserByIdService, UpdateExistingUserService, SubmitNewUserService, } from '../services/user-service';
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
    }else if(req.session.user.userId !== +id && req.session.user.role === "User"){
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
        userId,
        username,
        password,
        firstName,
        lastName,
        birthday,
        phoneNumber,
        email,
        role,
        } = req.body

        if(!userId || isNaN(req.body.userId)){
            next(new InvalidIdError())
            
        }else if(req.session.user.userId !== +userId  && req.session.user.role === "User"){
            next(new AuthenticationFailure())
        }else { 
        let updatedUser: Users = {
            userId,
            username, 
            password, 
            firstName,
            lastName,
            birthday,
            phoneNumber,
            email,
            role
        }
        updatedUser.username= username ||undefined
        updatedUser.password = password || undefined
        updatedUser.firstName = firstName || undefined
        updatedUser.lastName = lastName || undefined
        updatedUser.birthday = birthday || undefined
        updatedUser.phoneNumber = phoneNumber || undefined
        updatedUser.email = email || undefined
        updatedUser.role = role || undefined


        console.log(updatedUser)
        try {
            let updateResults = await UpdateExistingUserService(updatedUser)
            res.json(updateResults)
        } catch (error) {
            next(error)
        }
    }
})



userRouter.post('/',  async (req: Request, res: Response, next: NextFunction) => {
    // get input from the user
    let { firstName, lastName, username, password, birthday, phoneNumber, email, role} = req.body//a little old fashioned destructuring
    //verify that input
    if (!firstName || !lastName || !username || !password || !birthday || !email) {
        next(new UserMissingInputError)
    } else {
        //try  with a function call to the dao layer to try and save the user
        let newUser: Users = {
            firstName,
            lastName,
            username,
            password,
            birthday,
            phoneNumber,
            role,
            userId:0,
            email
        }
        newUser.phoneNumber = phoneNumber || null
        newUser.email = email || null
        newUser.role = role || 2
        try {
            let savedUser = await SubmitNewUserService(newUser)
            res.json(savedUser)// needs to have the updated userId
        } catch (e) {
            next(e)
        }
    }
})



