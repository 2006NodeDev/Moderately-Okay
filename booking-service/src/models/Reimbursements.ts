
export class Reimbursements {
    reimbursement_id: number // primary key
    author: number // foreign key --> User not null
    amount: number // not null
    date_submitted: Date// not null
    date_resolved: Date 
    description: String // not null
    resolver: number // foreign key --> User
    status: number // foreign key --> ReimbursementStatus, not null
    type: number // foreign key --> ReimbursementType

}


