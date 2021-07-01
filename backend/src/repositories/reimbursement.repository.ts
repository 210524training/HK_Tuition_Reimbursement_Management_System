import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from '../dynamo/dynamo';
import Reimbursement, { Status } from '../models/reimbursement';
import log from '../log';

class ReimbursementRepository {
  constructor(
    private docClient = dynamo,
  ) {}

  async addRequest(reimbursement: Reimbursement): Promise<boolean> {
    const params: DocumentClient.PutItemInput = {
      TableName: 'Reimbursements',
      Item: reimbursement,
    };

    const result = await this.docClient.put(params).promise();
    if(result) {
      // log.debug(result);
      return true;
    }
    return false;
  }

  async getRequestById(id: string): Promise<Reimbursement> {
    const params: DocumentClient.GetItemInput = {
      TableName: 'Reimbursements',
      Key: {
        id,
      },
    };

    const result = await this.docClient.get(params).promise();
    if(result.Item) {
      // log.debug(result);
      return result.Item as Reimbursement;
    }
    throw new Error('Reimbursement request not found');
  }

  async updateFinalGrade(id: string, finalgrade: string | undefined): Promise<boolean> {
    const params: DocumentClient.UpdateItemInput = {
      TableName: 'Reimbursements',
      Key: {
        id,
      },
      UpdateExpression: 'SET #fg = :v',
      ExpressionAttributeNames: {
        '#fg': 'finalgrade',
      },
      ExpressionAttributeValues: {
        ':v': finalgrade,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    const isUpdated = await this.docClient.update(params).promise();
    if(isUpdated) {
      return true;
    }
    throw new Error('Cannot update request');
  }

  async getAllRequestsByStatus(status: string): Promise<Reimbursement[]> {
    const params: DocumentClient.ScanInput = {
      TableName: 'Reimbursements',
      FilterExpression: '#s = :status',
      ExpressionAttributeNames: {
        '#s': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
      },
    };

    const results = await this.docClient.scan(params).promise();
    if(results.Items) {
      if(results.Items?.length > 0) {
        return results.Items as Reimbursement[];
      }
    }
    return [];
  }

  async getALLReimbursementRequestPendingReimbursement(): Promise<Reimbursement[]> {
    const params: DocumentClient.ScanInput = {
      TableName: 'Reimbursements',
      FilterExpression: '#s = :s',
      ExpressionAttributeNames: {
        '#s': 'status',
      },
      ExpressionAttributeValues: {
        ':s': 'Awaiting Benefits Coordinator',
      },
    };

    const results = await this.docClient.scan(params).promise();
    if(results.Items) {
      if(results.Items?.length > 0) {
        return results.Items as Reimbursement[];
      }
    }
    return [];
  }

  async updateReimbursementRequestStatus(

    id: string,
    status: Status,
  ): Promise<boolean> {
    console.log(id);
    console.log(status);
    const params: DocumentClient.UpdateItemInput = {
      TableName: 'Reimbursements',
      Key: {
        id,
      },
      UpdateExpression: 'SET #s = :v',
      ExpressionAttributeNames: {
        '#s': 'status',
      },
      ExpressionAttributeValues: {
        ':v': status,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    const isUpdated = await this.docClient.update(params).promise();
    if(isUpdated) {
      return true;
    }
    throw new Error('Cannot update request');
  }
}

export default new ReimbursementRepository();
