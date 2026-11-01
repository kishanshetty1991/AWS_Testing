import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { postSpaces } from './PostSpaces';
import { getSpaces } from './GetSpaces';
import { updateSpace } from './UpdateSpace';
import { deleteSpace } from './DeleteSpace';
import { JSONError, MissingFieldError } from '../shared/Validator';
import { addCorsHeader } from '../shared/Utils';


const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  let response: APIGatewayProxyResult;

  try {
    switch (event.httpMethod) {
      case 'GET':
        const getResponse = await getSpaces(event, ddbClient);
        console.log('GET response:', getResponse);
        response = getResponse;
        break;
      case 'POST':
        const postResponse = await postSpaces(event, ddbClient);
        response = postResponse;
        break;
      case 'PUT':
        const updateResponse = await updateSpace(event, ddbClient);
        console.log('PUT response:', updateResponse);
        response = updateResponse;
        break;
      case 'DELETE':
        const deleteResponse = await deleteSpace(event, ddbClient);
        console.log('DELETE response:', deleteResponse);
        response = deleteResponse;
        break;
      default:
        response = {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }
  } catch (error) {
    console.error('Error occurred:', error);
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


  addCorsHeader(response)
  return response;
};

export { handler };