import AWS from 'aws-sdk';

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: 'us-west-1',
  endpoint: 'https://dynamodb.us-west-1.amazonaws.com',
  apiVersion: 'latest',
});

export default dynamo;
