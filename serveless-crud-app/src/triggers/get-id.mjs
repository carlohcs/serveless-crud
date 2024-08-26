import { logError, logSuccess } from "../helpers/logger.mjs"
import { lambda } from "../helpers/setup-lambda.mjs"

const args = process.argv.slice(2)

const payload = {
  httpMethod: "GET",
  pathParameters: {
    id: args[0] || "1"
  }
}

const params = {
  FunctionName: "GetByIdLambdaFunction",
  // we need to take the entire function name from the AWS console (when FunctionName is not defined)
  // FunctionName: "serveless-crud-app-GetByIdLambdaFunction-zrwjZeOIWA6Z",
  Payload: JSON.stringify(payload)
}

console.log("Requesting with: ", params)

lambda.invoke(params, (err, data) => {
  if (err) {
    logError("Error running GetByIdLambdaFunction", err)
  } else {
    logSuccess(
      "Success running GetByIdLambdaFunction",
      JSON.parse(data.Payload)
    )
  }
})
