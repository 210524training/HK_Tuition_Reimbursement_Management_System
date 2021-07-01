import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import log from '../log';
import dynamo from '../dynamo/dynamo';
import User from '../models/user';
import Reimbursement from '../models/reimbursement';

class UserRepository {
  constructor(
    private docClient = dynamo,
  ) { }

  async getByUsername(inputusername: string): Promise<User | null> {
    // log.debug(inputusername);
    const params: DocumentClient.GetItemInput = {

      TableName: 'Users',
      Key: {
        username: inputusername,
      },
      ProjectionExpression: '#u, #p, #e, #r, availableAmount',
      ExpressionAttributeNames: {
        '#u': 'username',
        '#p': 'password',
        '#e': 'email',
        '#r': 'role',
      },
    };

    const data = await this.docClient.get(params).promise();

    if(data) {
      // log.debug(data);
      return (data.Item) as User;
    }
    return null;
  }

  async updateAmountByUsername(username: string, amount: number): Promise<void> {
    const params: DocumentClient.UpdateItemInput = {
      TableName: 'Users',
      Key: { username },
      UpdateExpression: 'SET availableAmount = :a',
      ExpressionAttributeValues: {
        ':a': amount,
      },
    };
    try {
      await this.docClient.update(params).promise();
    } catch(err) {
      log.error(err);
    }
  }

  async addUser(user: User): Promise<boolean> {
    const params: DocumentClient.PutItemInput = {
      TableName: 'Users',
      Item: {
        ...user,
      },
      ConditionExpression: '#u <> :u',
      ExpressionAttributeNames: {
        '#u': user.username,
      },
      ExpressionAttributeValues: {
        ':u': user.username,
      },
    };
    try {
      await this.docClient.put(params).promise();
      return true;
    } catch(err) {
      log.error(err);
      return false;
    }
  }

  async getAllRequestsByUsername(username: User): Promise<Reimbursement[]> {
    const params: DocumentClient.ScanInput = {
      TableName: 'Reimbursements',
      FilterExpression: '#e = :user',
      ExpressionAttributeNames: {
        '#e': 'employeeName',
      },
      ExpressionAttributeValues: {
        ':user': username.username,
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
}

export default new UserRepository();
