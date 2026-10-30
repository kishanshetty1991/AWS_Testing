import { DeleteItemCommand, DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { hasAdminGroup } from "../shared/Utils";

export async function deleteSpace(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    if(!hasAdminGroup(event)) {
        return {
            statusCode: 403,
            body: JSON.stringify({ message: "Unauthorized" })
        };
    }

    let spaceId: string | undefined = undefined;
    if(event.queryStringParameters && ('id' in event.queryStringParameters)) {
        spaceId = event.queryStringParameters.id ?? '';
        await ddbClient.send(new DeleteItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: { 
                id: {S: spaceId} 
            }
        }));

    return {
        statusCode: 200,
        body: JSON.stringify({ message: `Space with id ${spaceId} deleted successfully` })
    };
    }
    

    return {
        statusCode: 204,
        body: JSON.stringify({ message: `Please pass the space ID` })
    };
}
