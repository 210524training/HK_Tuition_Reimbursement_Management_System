import { Router } from 'express';
import ReimbursementService from '../services/reimbursement.service';
import log from '../log';

const reimbursementRouter = Router();

/**
 * This route will:
 * retrieve logged in user's bin
 */
reimbursementRouter.get('/', async (req, res) => {
  const { user } = req.session;

  try {
    if(user) {
      const didPopulateBin = await ReimbursementService.populateUserBin(user);
      if(didPopulateBin) {
        log.debug(didPopulateBin);
        res.send(didPopulateBin);
      }
    }
  } catch(err) {
    log.error(err);
    res.sendStatus(400);
  }
});

/**
 * This route will:
 * create logged in user's reimburement request
 */
reimbursementRouter.post('/', async (req, res) => {
  let currentUserRole: string = '';

  if(req.session.user) {
    currentUserRole = req.session.user.role;
  }

  const {
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

  } = req.body;

  try {
    const isSubmissionSuccessful = await ReimbursementService.constructNewRequest(
      currentUserRole,
      employeeName,
      employeeEmail,
      eventType,
      dateStarted,
      timeStarted,
      location,
      description,
      Number(cost),
      gradingFormat,
      passingGrade,
      finalgrade,
      projectedAmount,
    );

    if(isSubmissionSuccessful) {
      res.json(201);
    } else {
      res.sendStatus(400);
    }
  } catch(err) {
    log.error(err);
    res.sendStatus(400);
  }
});

/**
 * This route will:
 * update logged a user's reimburement request's grade
 */
reimbursementRouter.put('/:id', async (req, res) => {
  const { id } = req.body;
  const { finalgrade } = req.body;
  res.json(await ReimbursementService.addFinalGrade(id, finalgrade));
});

reimbursementRouter.put('/status', async (req, res) => {
  console.log('Hey');
  const { id } = req.body;
  const { status } = req.body;
  console.log(id, status);
  res.json(await ReimbursementService.updateStatus(id, status));
});

reimbursementRouter.get('/pending', async (req, res) => {
  res.json(await ReimbursementService.getPendingReimbursements());
});

export default reimbursementRouter;
