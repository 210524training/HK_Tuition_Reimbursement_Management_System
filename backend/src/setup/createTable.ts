import AWS from 'aws-sdk';

// const docClient = new AWS.DynamoDB.DocumentClient();

AWS.config.update({ region: 'us-west-1' });

const dynamo = new AWS.DynamoDB({ apiVersion: 'latest' });

const params: AWS.DynamoDB.CreateTableInput = {
  TableName: 'Reimbursements',
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: 'HASH',
    },
  ],
  AttributeDefinitions: [
    {
      AttributeName: 'id',
      AttributeType: 'S',
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 2,
    WriteCapacityUnits: 2,
  },
  StreamSpecification: {
    StreamEnabled: false,
  },
};

dynamo.createTable(params, (err, data) => {
  if(err) {
    console.log('error', err);
  } else {
    console.log('Table Created', data);
  }
});
