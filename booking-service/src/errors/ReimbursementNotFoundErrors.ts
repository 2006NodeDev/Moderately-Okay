import { HttpError } from "./HttpError";

export class ReimbursementNotFound extends HttpError{
    constructor(){
        super(404, 'Reimbursement not found')
    }
}