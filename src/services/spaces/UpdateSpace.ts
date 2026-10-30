import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function updateSpace(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    if(event.queryStringParameters && ('id' in event.queryStringParameters) && event.body) {
        const parsedBody = JSON.parse(event.body);
        const spaceId = event.queryStringParameters.id ?? '';
        const requestBodyKey = Object.keys(parsedBody)[0];
        const requestBodyValue = parsedBody[requestBodyKey as any];
        console.log(`Updating space with id: ${spaceId}, key: ${requestBodyKey}, value: ${requestBodyValue}`);
        const updateResult = await ddbClient.send(new UpdateItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: { 
                id: {S: spaceId} 
            },
            UpdateExpression: 'set #keyName = :newValue',
            ExpressionAttributeValues: {
                ':newValue': { S: requestBodyValue }
            },
            ExpressionAttributeNames: {
                '#keyName': requestBodyKey
            },
            ReturnValues: 'UPDATED_NEW'
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Space with id ${spaceId} updated successfully`, updatedAttributes: updateResult.Attributes })
        }
    }
    


    return {
        statusCode: 204,
        body: JSON.stringify('Please provide the "id" query parameter and a valid request body to update the space.'),
    };
}
