import express, { Router } from 'express';
import userRouter from './user.router';
import reimbursementRouter from './reimbursement.router';
import UserService from '../services/user.service';
import reimbursementService from '../services/reimbursement.service';
import log from '../log';

const baseRouter = Router();

baseRouter.post('/', async (req: express.Request<unknown, unknown, { username: string, password: string }, unknown, {}>, res) => {
  // get user info from frontend
  const { username, password } = req.body;
  log.debug(username, password);

  // verify user from database
  const user = await UserService.verifyUser(username, password);
  log.debug(user);
  req.session.isLoggedIn = true;
  req.session.user = user;
  try {
    await reimbursementService.populateUserBin(user);
  } catch(err) {
    log.debug(err);
  }
  // res.json(req.session.user);
  res.json(req.session.user);
});

export async function logout(req: express.Request, res: express.Response): Promise<void> {
  if(req.session.user) {
    const { username } = req.session.user;

    req.session.destroy(() => {
      console.log(`${username} logged out`);
    });
  }

  res.status(202).send();
}

baseRouter.post('/logout', logout);

baseRouter.use('/api/v1/:user', userRouter);
baseRouter.use('/api/v1/:user/reimbursement-requests', reimbursementRouter);

export default baseRouter;
