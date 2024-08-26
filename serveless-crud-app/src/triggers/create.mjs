import { logError, logSuccess } from "../helpers/logger.mjs"
import { lambda } from "../helpers/setup-lambda.mjs"

const args = process.argv.slice(2)

const payload = {
  httpMethod: "POST",
  body: JSON.stringify({
    name: args[0] || "John Doe"
  })
}

const params = {
  FunctionName: "CreateItemLambdaFunction",
  // we need to take the entire function name from the AWS console (when FunctionName is not defined)
  // FunctionName: "serveless-crud-app-CreateItemLambdaFunction-eddSJY1H9fYa",
  Payload: JSON.stringify(payload)
}

console.log("Requesting with: ", params)

lambda.invoke(params, (err, data) => {
  if (err) {
    logError("Error running CreateItemLambdaFunction", err)
  } else {
    logSuccess(
      "Success running CreateItemLambdaFunction",
      JSON.parse(data.Payload)
    )
  }
})
