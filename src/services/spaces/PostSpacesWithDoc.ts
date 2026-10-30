import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createRandomId } from "../shared/Utils";


export async function postSpacesWithDoc(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    const randomId = createRandomId();
    const item = JSON.parse(event.body || '{}');
    const ddbDocumentClient = DynamoDBDocumentClient.from(ddbClient);

    const result = await ddbDocumentClient.send(
        new PutItemCommand({
        TableName: process.env.TABLE_NAME || '',
        Item: item
    }));

    console.log('DynamoDB Kishan PutItem result:', JSON.stringify(result));

    return {
        statusCode: 200,
        body: JSON.stringify({ id: randomId})
    };
}
