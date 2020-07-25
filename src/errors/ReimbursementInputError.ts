import { HttpError } from "./HttpError";


export class ReimbursementInputError extends HttpError {
    constructor(){//has no params
        super(400, 'Please fill out all necessary fields')
    }
}