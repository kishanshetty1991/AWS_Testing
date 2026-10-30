import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { postSpaces } from './PostSpaces';
import { getSpaces } from './GetSpaces';
import { updateSpace } from './UpdateSpace';
import { deleteSpace } from './DeleteSpace';
import { JSONError, MissingFieldError } from '../shared/Validator';


const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  let message: string;

  try {
    switch (event.httpMethod) {
      case 'GET':
        const getResponse = await getSpaces(event, ddbClient);
        console.log('GET response:', getResponse);
        return getResponse;
      case 'POST':
        const postResponse = await postSpaces(event, ddbClient);
        return postResponse;
      case 'PUT':
        const updateResponse = await updateSpace(event, ddbClient);
        console.log('PUT response:', updateResponse);
        return updateResponse;
      case 'DELETE':
        const deleteResponse = await deleteSpace(event, ddbClient);
        console.log('DELETE response:', deleteResponse);
        return deleteResponse;
      default:
        message = `Hello from ${event.httpMethod} method!`;
        break;
    }
  } catch (error) {
    console.error('Error occurred:', error);
    message = 'Error out'
    if (error instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message),
      };
    }

    if (error instanceof JSONError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error::', message: error instanceof Error ? error.message : 'Unknown error' }),
    };
  }



  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message),
  };

  return response;
};

export { handler };