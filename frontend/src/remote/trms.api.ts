import Reimbursement from "../models/reimbursement";
import User from "../models/user";
import trmsClient from "./trms.client";

export const sendLogin = async (username: string, password: string): Promise<User> => {
  const {data: user} = await trmsClient.post<User>('/', {
    username,
    password,
  });
  
  return user as User;
}

export const sendStatusUpdate = async (id: string | undefined, status: string | undefined): Promise<void> => {
  console.log(id, status)
  await trmsClient.put<any>(`/api/v1/${id}/reimbursement-requests/status`, {
    id,
    status,
  });
}

export const sendUpdateFinalGrade = async(finalgrade: string, id: undefined | string): Promise<void> => {
  await trmsClient.put<any>(`/api/v1/${id}/reimbursement-requests/${id}`, {
    finalgrade,
    id,
  });
}

export const sendForm = async (
  employeeName: string, 
  employeeEmail: string,
  dateStarted: string,
  timeStarted: string,
  location: string, 
  description: string, 
  cost: string, 
  gradingFormat: string,
  passingGrade: string,
  finalgrade: string,
  eventType: string,
  projectedAmount: number,

  ): Promise<Reimbursement> => {
  const {data: formData} = await trmsClient.post<Reimbursement>(`/api/v1/${employeeName}/reimbursement-requests`, {
    employeeName,
      employeeEmail,
      eventType,
      dateStarted,
      timeStarted,
      location,
      description,
      cost,
      gradingFormat,
      passingGrade,
      finalgrade,
      projectedAmount,
  });

  return formData as Reimbursement;
}

export const getUserRequests = async (user: User | undefined): Promise<Reimbursement[]> => {
  const {data: request} = await trmsClient.get<Reimbursement[]>(`/api/v1/${user?.username}/reimbursement-requests`);

  return request as Reimbursement[];
}

export const getUserOwnedRequests = async (user: User): Promise<Reimbursement[]> => {
  const {data: request} = await trmsClient.get<Reimbursement[]>(`/api/v1/${user.username}`);

  return request as Reimbursement[];
}

export const getRequestsPendingPayment = async (): Promise<Reimbursement[]> => {
  const {data: requests} = await trmsClient.get<Reimbursement[]>('/api/v1/:user/reimbursement-requests/pending')

  return requests as Reimbursement[];
}

export const getAllRequests= async (): Promise<Reimbursement[]> => {
  const {data: requests} = await trmsClient.get<Reimbursement[]>('/api/v1/:user/reimbursement-requests/all')

  return requests as Reimbursement[];
}

export const sendUpdateAmount = async(id: string | undefined, amount: number, isExceedingFunds: boolean): Promise<void> => {
  await trmsClient.put<any>(`/api/v1/${id}/reimbursement-requests/${id}/amount`, {
    id,
    amount,
    isExceedingFunds,
  });
}

export const sendRefund = async (username: string | undefined, refund: number | undefined): Promise<void> => {
  await trmsClient.put<any>(`/api/v1/:user/refund`, {
    username,
    refund
  })
}

export const sendDeleteRequest = async (request: Reimbursement | undefined): Promise<void> => {
  const {data: requests} = await trmsClient.delete<any>(`/api/v1/${request?.id}/reimbursement-requests/${request?.id}`)

  return requests
}
