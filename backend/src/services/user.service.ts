import UserRepository from '../repositories/user.repository';
import User from '../models/user';
import { WrongUserNameError, UserNotAddedError, UserNotFoundError } from '../errors';
import Reimbursement from '../models/reimbursement';
import reimbursementRepository from '../repositories/reimbursement.repository';

class UserService {
  constructor(
    public UserData = UserRepository,
    public ReimbursementData = reimbursementRepository,
  ) { }

  async verifyUser(username: string, password: string): Promise<User> {
    const isFound = await this.UserData.getByUsername(username);
    if(!isFound) {
      throw new UserNotFoundError();
    }
    if(password !== isFound?.password) {
      throw new WrongUserNameError();
    }
    return isFound;
  }

  async registerUser(
    username: string,
    password: string,
    email: string,
  ): Promise<boolean> {
    const user = await this.UserData.addUser(new User(username, password, email, 'Employee'));
    if(!user) {
      throw new UserNotAddedError();
    }
    return user;
  }

  async updateAmount(username: string, amount: number): Promise<void> {
    await this.UserData.updateAmountByUsername(username, amount);
  }

  async getUserRequests(username: User): Promise<Reimbursement[]> {
    console.log('username: ', username);
    const requests = await this.UserData.getAllRequestsByUsername(username);
    return requests as Reimbursement[];
  }
}

export default new UserService();
