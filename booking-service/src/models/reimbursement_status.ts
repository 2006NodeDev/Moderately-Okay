/**ReimbursementStatus**  
The ReimbursementStatus model is used to track the status of reimbursements. Status possibilities are `Pending`, `Approved`, or `Denied`.
*/

export class reimbursementStatus{
  status_id: number  // primary key
  status: string  // not null, unique
}