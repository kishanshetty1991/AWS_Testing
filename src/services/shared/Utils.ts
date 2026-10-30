import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { JSONError } from "./Validator";
import { randomUUID } from "crypto";

export function createRandomId() {
    return randomUUID();
}

export function parseJSON(arg: string){
    try {
        return JSON.parse(arg);
    }
    catch (error: any) {
        throw new JSONError(error?.message);
    }
}

export function hasAdminGroup(event: APIGatewayProxyEvent) {
    const groups = event.requestContext.authorizer?.claims['cognito:groups'];
    return groups?.includes('admins') ?? false;
}