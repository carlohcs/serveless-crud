import { logError, logSuccess } from "../helpers/logger.mjs"
import { lambda } from "../helpers/setup-lambda.mjs"

const args = process.argv.slice(2)

const payload = {
  httpMethod: "DELETE",
  pathParameters: {
    id: args[0] || "1"
  }
}

const params = {
  FunctionName: "DeleteItemLambdaFunction",
  // we need to take the entire function name from the AWS console (when FunctionName is not defined)
  // FunctionName: "serveless-crud-app-DeleteItemLambdaFunction-lMkaUCtS65dO",
  Payload: JSON.stringify(payload)
}

console.log("Requesting with: ", params)

lambda.invoke(params, (err, data) => {
  if (err) {
    logError("Error running DeleteItemLambdaFunction", err)
  } else {
    logSuccess(
      "Success running DeleteItemLambdaFunction",
      JSON.parse(data.Payload)
    )
  }
})
