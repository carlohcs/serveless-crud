import { logError, logSuccess } from "../helpers/logger.mjs"
import { lambda } from "../helpers/setup-lambda.mjs"

const payload = {
  httpMethod: "GET"
}

const params = {
  // we need to take the entire function name from the AWS console
  // FunctionName: "CreateTableLambdaFunction",
  FunctionName: "serveless-crud-app-CreateTableLambdaFunction-9b3TJJaL9e2a",
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
