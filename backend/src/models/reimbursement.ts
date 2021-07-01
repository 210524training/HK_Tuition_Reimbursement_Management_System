import { v4 as uuidv4 } from 'uuid';

export default class Reimbursement {
  constructor(
    public id: string = uuidv4(),
    public employeeName: string,
    public employeeEmail: string,
    public dateSubmitted: Date | string,
    public eventType: EventType,
    public dateStarted: Date,
    public timeStarted: string,
    public location: string,
    public description: string,
    public cost: number,
    public gradingFormat: 'Grade' | 'Presentation',
    public passingGrade: string,
    public finalgrade: string | undefined,
    public finalGradeSatisfactory: boolean | undefined,
    public status: Status,
    public projectedAmount: number,
  ) { }
}

export type EventType = 'University Course' | 'Seminar' | 'Certification Prep' | 'Certification' | 'Technical' | 'Other'
export type Status = 'Direct Supervisor Approval' | 'Department Head Approval' | 'Benefits Coordinator Approval' | 'Awaiting Employee' | 'Awaiting Direct Supervisor' | 'Awaiting Department Head' | 'Awaiting Benefits Coordinator' | 'Returned to Employee' | 'Returned to Department Head' | 'Returned to Direct Supervisor' | 'Pending Reimbursement' | 'Reimbursement Approved' | 'Reimbursement Rejected'
