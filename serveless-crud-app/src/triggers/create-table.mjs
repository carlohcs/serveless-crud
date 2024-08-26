import { logError, logSuccess } from "../helpers/logger.mjs"
import { lambda } from "../helpers/setup-lambda.mjs"

const payload = {
  httpMethod: "GET"
}

const params = {
  FunctionName: "CreateTableLambdaFunction",
  // we need to take the entire function name from the AWS console (when FunctionName is not defined)
  // FunctionName: "serveless-crud-app-CreateTableLambdaFunction-9b3TJJaL9e2a",
  Payload: JSON.stringify(payload)
}

console.log("Requesting with: ", params)

lambda.invoke(params, (err, data) => {
  if (err) {
    logError("Error running CreateTableLambdaFunction", err)
  } else {
    logSuccess(
      "Success running CreateTableLambdaFunction",
      JSON.parse(data.Payload)
    )
  }
})
