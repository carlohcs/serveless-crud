import { logError, logSuccess } from "../helpers/logger.mjs"
import { lambda } from "../helpers/setup-lambda.mjs"

const payload = {
  httpMethod: "GET"
}

const params = {
  FunctionName: "GetAllItemsLambdaFunction",
  // we need to take the entire function name from the AWS console (when FunctionName is not defined)
  // FunctionName: "serveless-crud-app-GetAllItemsLambdaFunction-OE22TZ2B5hqs",
  Payload: JSON.stringify(payload)
}

console.log("Requesting with: ", params)

lambda.invoke(params, (err, data) => {
  if (err) {
    logError("Error running GetAllItemsLambdaFunction", err)
  } else {
    logSuccess(
      "Success running GetAllItemsLambdaFunction",
      JSON.parse(data.Payload)
    )
  }
})
