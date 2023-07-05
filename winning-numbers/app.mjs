import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

export const post = async (event, context) => {
    let today = new Date()
    let dateStr = today.getYear() + "-" + today.getMonth() + "-" + today.getDate();

    let nOne   = getRandomInt(1, 70)
    let nTwo   = getRandomInt(1, 70)
    let nThree = getRandomInt(1, 70)
    let nFour  = getRandomInt(1, 70)
    let nFive  = getRandomInt(1, 70)

    let item = {
        date: dateStr,
        numbers: [nOne, nTwo, nThree, nFour, nFive]
    }

    let params = {
        TableName: process.env.TABLE_NAME,
        Item: item,
        ConditionExpression: "#date <> :date",
        ExpressionAttributeNames: { 
            "#date" : "date"
         },
        ExpressionAttributeValues: {
            ":date": item.date
        }
    }

    const command = new PutCommand(params);

    try {
        const data = await ddbDocClient.send(command);
        return {
            'statusCode': 200,
            'body': JSON.stringify({
                'data': data
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }
};

export const get = async (event, context) => {
    try {
        return {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'hello world',
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }
};