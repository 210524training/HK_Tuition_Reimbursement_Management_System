import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Reimbursement from '../../models/reimbursement';
import User from '../../models/user';
import { getUserRequests } from '../../remote/trms.api';

type Props = {
  setRequest: Dispatch<SetStateAction<undefined | Reimbursement>>;
  currentUser: User | undefined;
}

const RequestsTable: React.FC<Props> = ({ currentUser, setRequest }) => {

  const [tableData, setTableData] = useState<Reimbursement[]>([]);

  const history = useHistory();

  useEffect(() => {
    (async function populateTable(): Promise<void> {
      if(currentUser) {
        const data =  await getUserRequests(currentUser)
        setTableData(data)
      }
    })();
  },[currentUser])

  const handleClick = (request: any): void => {
    setRequest(request);
    history.push(`/workstation/${request.id}`)
    console.log(request);
  }
  
  const tableRows = tableData.map((item: Reimbursement, index) => (
    <tr key={index} onClick={() => handleClick(item)}>
      <td>{item.dateSubmitted}</td>
      <td>{item.employeeName}</td>
      <td>{item.employeeEmail}</td>
      <td>{item.eventType}</td>
      <td>{item.description}</td>
      <td>{item.location}</td>
      <td>{item.cost}</td>
      <td>{item.dateStarted}</td>
      <td>{item.timeStarted}</td>
      <td>{item.gradingFormat}</td>
      <td>{item.projectedAmount}</td>
    </tr>
  ))

  return(
    <Table responsive striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Submitted</th>
          <th>Username</th>
          <th>Email</th>
          <th>Event</th>
          <th>Description</th>
          <th>Location</th>
          <th>Cost</th>
          <th>Start Date</th>
          <th>Start Time</th>
          <th>Graded By</th>
          <th>Comments</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </Table>
  )
}

export default RequestsTable;
