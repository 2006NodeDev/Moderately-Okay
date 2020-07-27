import { ReimbursementsDTO } from "../dtos/reim-dto";
import { Reimbursements } from "../models/Reimbursements";

export function ReimDTOtoReimbursementConvertor(rdto:ReimbursementsDTO) : Reimbursements{
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