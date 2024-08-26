// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb"
const client = new DynamoDBClient({})
const ddbDocClient = DynamoDBDocumentClient.from(client)

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
export const getAllItemsHandler = async (event) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getAllItems only accept GET method, you tried: ${JSON.stringify(event.httpMethod)}`
    )
  }
  // All log statements are written to CloudWatch
  console.info("received:", event)

  // get all items from the table (only first 1MB data, you can use `LastEvaluatedKey` to get the rest of data)
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
  // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
  var params = {
    TableName: tableName
  }

  try {
    const data = await ddbDocClient.send(new ScanCommand(params))
    var items = data.Items
  } catch (err) {
    console.log("Error", err)
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(items)
  }

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  )
  return response
}

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */
export const getByIdHandler = async (event) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getMethod only accept GET method, you tried: ${JSON.stringify(event.httpMethod)}`
    )
  }
  // All log statements are written to CloudWatch
  console.info("received:", event)

  // Get id from pathParameters from APIGateway because of `/{id}` at template.yaml
  const id = event.pathParameters.id

  // Get the item from the table
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property
  var params = {
    TableName: tableName,
    Key: { id: id }
  }

  try {
    const data = await ddbDocClient.send(new GetCommand(params))
    var item = data.Item
  } catch (err) {
    console.log("Error", err)
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(item)
  }

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  )
  return response
}

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const putItemHandler = async (event) => {
  if (event.httpMethod !== "POST") {
    throw new Error(
      `postMethod only accepts POST method, you tried: ${JSON.stringify(event.httpMethod)} method.`
    )
  }
  // All log statements are written to CloudWatch
  console.info("received:", event)

  // Get id and name from the body of the request
  const body = JSON.parse(event.body)
  const id = body.id
  const name = body.name

  // Creates a new item, or replaces an old item with a new item
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
  var params = {
    TableName: tableName,
    Item: { id: id, name: name }
  }

  try {
    const data = await ddbDocClient.send(new PutCommand(params))
    console.log("Success - item added or updated", data)
  } catch (err) {
    console.log("Error", err.stack)
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(body)
  }

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  )
  return response
}
