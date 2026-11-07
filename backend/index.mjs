import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "TasksTable";

export const handler = async (event) => {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    try {
        const method = event.httpMethod;
        
        if (method === "POST") {
            const body = JSON.parse(event.body);
            const taskItem = {
                taskId: Date.now().toString(),
                description: body.description,
                createdAt: new Date().toISOString()
            };
            await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: taskItem }));
            return { statusCode: 201, headers, body: JSON.stringify(taskItem) };
        } 
        
        else if (method === "GET") {
            const data = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
            return { statusCode: 200, headers, body: JSON.stringify(data.Items) };
        } 
        
        else if (method === "DELETE") {
            const { taskId } = JSON.parse(event.body);
            await docClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { taskId } }));
            return { statusCode: 200, headers, body: JSON.stringify({ message: "Task deleted" }) };
        }

        return { statusCode: 400, headers, body: JSON.stringify({ message: "Unsupported method" }) };
    } catch (err) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
};
