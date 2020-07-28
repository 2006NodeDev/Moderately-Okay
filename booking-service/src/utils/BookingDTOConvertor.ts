import { BookingDTO } from "../dtos/book-dto";
import { Bookings } from "../models/Bookings";

//changed function call  DONE
//updates rdtos after updating book dto fields - inside return
//update fields per db fields
//updated model name to bookings DONE

export function BookingDTOtoBookingConvertor(rdto:BookingDTO) : Bookings{
    return {
        reimbursement_id: rdto.reimbursement_id,
        author: rdto.author,
        amount: rdto.amount,
        date_submitted: new Date(rdto.date_submitted),
        date_resolved: new Date(rdto.date_submitted),
        description: rdto.description,
        resolver: rdto.resolver,
        status: rdto.status,
        type: rdto.type
    }

}