import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { validateSpaceEntry } from "../shared/Validator";
import { marshall } from "@aws-sdk/util-dynamodb";
import { createRandomId, parseJSON } from "../shared/Utils";

export async function postSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    const randomId = createRandomId();
    const item = parseJSON(event.body || '{}');
    item.id = randomId;
    validateSpaceEntry(item);

    const result = await ddbClient.send(
        new PutItemCommand({
        TableName: process.env.TABLE_NAME || '',
        Item: marshall(item)
    }));

    console.log('DynamoDB Kishan PutItem result:', JSON.stringify(result));

    return {
        statusCode: 200,
        body: JSON.stringify({ id: randomId})
    };
}
