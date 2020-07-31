import { HttpError } from "./HttpError";

//updated reimbur ->booking DONE
export class BookingNotFound extends HttpError{
    constructor(){
        super(404, 'Booking not found')
    }
}