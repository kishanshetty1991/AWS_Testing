import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { createRandomId } from './shared/Utils';


const s3Client = new S3Client({});

async function handler(event: APIGatewayProxyEvent, context: Context) {

  const command = new ListBucketsCommand({});
  const listBucketsResponse = (await s3Client.send(command)).Buckets;


  const response: APIGatewayProxyResult ={
    statusCode: 200,
    body: JSON.stringify(`Hello from Kishan\'s Lambda! ${createRandomId()} here are the buckets: ${JSON.stringify(listBucketsResponse)}`),
  };

  console.log('Event:', event);
  console.log('Context:', context);
  return response;
};

export { handler };