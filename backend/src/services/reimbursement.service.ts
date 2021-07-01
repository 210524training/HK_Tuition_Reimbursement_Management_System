import ReimbursementRepository from '../repositories/reimbursement.repository';
import Reimbursement, { EventType, Status } from '../models/reimbursement';
import User from '../models/user';
import log from '../log';

class ReimbursementService {
  constructor(
    private data = ReimbursementRepository,
  ) {}

  // eslint-disable-next-line class-methods-use-this

  /**
   * Following method is responsible for converting user data into a Reimbursement
   * TODO: Dates need to be formatted into so they are more uniformed.
   */
  async constructNewRequest(
    currentUserRole: string,
    employeeName: string,
    employeeEmail: string,
    eventType: EventType,
    dateStarted: Date,
    timeStarted: string,
    location: string,
    description: string,
    cost: number,
    gradingFormat: 'Grade' | 'Presentation',
    passingGrade: string,
    attachments: File| null,
    projectedAmount: number,
  ): Promise<boolean> {
    // server generated data for the request
    const dateSubmitted = new Date();
    const id = Math.random().toString(36).substring(7);

    let currentStatus: Status;

    switch (currentUserRole) {
    case 'Direct Supervisor':
      currentStatus = 'Awaiting Department Head';
      break;
    case 'Department Head':
      currentStatus = 'Awaiting Benefits Coordinator';
      break;
    default:
      currentStatus = 'Awaiting Direct Supervisor';
    }

    // create new request object
    const request = new Reimbursement(
      id,
      employeeName,
      employeeEmail,
      dateSubmitted.toDateString(),
      eventType,
      dateStarted,
      timeStarted,
      location,
      description,
      cost,
      gradingFormat,
      passingGrade,
      '',
      undefined,
      currentStatus,
      projectedAmount,
    );
    const isSentToDynamo = await this.data.addRequest(request);
    return isSentToDynamo;
  }

  async addFinalGrade(id: string, finalgrade: string | undefined): Promise<boolean> {
    // Check to verify docid exists and matches provided docid
    const verifyId = await this.data.getRequestById(id);
    if(verifyId.id === id) {
      const isUpdated = await this.data.updateFinalGrade(id, finalgrade);
      if(isUpdated) {
        return true;
      }
      throw new Error('Grade could not be updated');
    }
    throw new Error('Reimburesment request does not exist');
  }

  /**
   * Requests data to populate the user's bin according to the role assigned and status of request
   */

  async populateUserBin(user: User): Promise<Reimbursement[]> {
    return this.data.getAllRequestsByStatus(`Awaiting ${user.role}`);
  }

  /**
   * This function will update the status of the request
   */
  async updateStatus(
    id: string,
    status: Status,
  ): Promise<boolean> {
    log.debug(status);
    let newStatus: Status;

    switch (status) {
    case 'Direct Supervisor Approval':
      newStatus = 'Awaiting Department Head';
      break;
    case 'Department Head Approval':
      newStatus = 'Awaiting Benefits Coordinator';
      break;
    case 'Benefits Coordinator Approval':
      newStatus = 'Pending Reimbursement';
      break;
    case 'Returned to Employee':
      newStatus = 'Awaiting Employee';
      break;
    case 'Returned to Department Head':
      newStatus = 'Awaiting Department Head';
      break;
    case 'Returned to Direct Supervisor':
      newStatus = 'Awaiting Direct Supervisor';
      break;
    case 'Reimbursement Approved':
      newStatus = status;
      break;
    case 'Reimbursement Rejected':
      newStatus = status;
      break;
    case 'Pending Reimbursement':
      newStatus = status;
      break;
    default:
      throw new Error('Invalid Status Assigned');
    }
    console.log(newStatus);
    const isUpdated = await this.data.updateReimbursementRequestStatus(id, newStatus);
    if(!isUpdated) {
      throw new Error('Could not be updated');
    }
    return true;
  }

  async getPendingReimbursements(): Promise<Reimbursement[]> {
    const data = await this.data.getALLReimbursementRequestPendingReimbursement();
    if(data.length === 0) {
      return [];
    }
    return data;
  }
}

export default new ReimbursementService();
