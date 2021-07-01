export default interface Reimbursement {
    id: string;
    employeeName: string;
    employeeEmail: string;
    dateSubmitted: Date;
    eventType: EventType;
    dateStarted: Date;
    timeStarted: string;
    location: string;
    description: string;
    cost: number;
    gradingFormat: 'Grade' | 'Presentation';
    passingGrade: string;
    finalgrade: string | undefined;
    finalGradeSatisfactory: boolean | undefined;
    status: Status;
    projectedAmount: number;
    exceedingFunds: boolean,
    attachments: File | null,
}

export type EventType = 'University Course' | 'Seminar' | 'Certification Prep' | 'Certification' | 'Technical' | 'Other'
export type Status = 'Direct Supervisor Approval' | 'Department Head Approval' | 'Benefits Coordinator Approval' | 'Awaiting Direct Supervisor' | 'Awaiting Department Head' | 'Awaiting Benefits Coordinator' | 'Returned to Employee' | 'Returned to Department Head' | 'Returned to Direct Supervisor' | 'Pending Reimbursement' | 'Reimbursement Approved' | 'Awaiting Employee' | 'Reimbursement Rejected'
