import express, { Router } from 'express';
import Reimbursement from '../models/reimbursement';
import User from '../models/user';
import reimbursementService from '../services/reimbursement.service';
import UserService from '../services/user.service';
import log from '../log';

const userRouter = Router();

/**
 * This route will get requests that the user submitted
 */
userRouter.get('/', async (req, res) => {
  if(!req.session.isLoggedIn || !req.session.user) {
    res.send(401);
    throw new Error('Not Authorized: You must be logged in.');
  }
  const { user } = req.session;
  try {
    res.json(await UserService.getUserRequests(user));
  } catch(err) {
    res.send(err);
  }
});

userRouter.put('/', async (req: express.Request<unknown, unknown, Reimbursement, unknown, {}>, res) => {
  const { id, finalgrade } = req.body;
  console.log('req bodyis:', req.body);
  try {
    const isUpdated = await reimbursementService.addFinalGrade(id, finalgrade);
    if(isUpdated) {
      res.sendStatus(200);
    }
  } catch(err) {
    log.error(err);
    res.sendStatus(400);
  }
});

userRouter.put('/refund', async (req, res) => {
  const { username, refund } = req.body;
  console.log('req bodyis:', req.body);
  res.json(await UserService.updateAmount(username, refund));
});

userRouter.post('/', async (req: express.Request<unknown, unknown, User, unknown, {}>, res) => {
  const { username, password, email } = req.body;
  res.json(await UserService.registerUser(username, password, email));
});

export default userRouter;
