import { logError, logSuccess } from "../helpers/logger.mjs"
import { lambda } from "../helpers/setup-lambda.mjs"

const args = process.argv.slice(2)

const payload = {
  httpMethod: "PUT",
  pathParameters: {
    id: args[0] || "1"
  },
  body: JSON.stringify({
    name: args[1] || "Jane Doe"
  })
}

const params = {
  // we need to take the entire function name from the AWS console
  // FunctionName: "UpdateItemLambdaFunction",
  FunctionName: "serveless-crud-app-UpdateItemLambdaFunction-uO7boV4tgzmi",
  Payload: JSON.stringify(payload)
}

console.log("Requesting with: ", params)

lambda.invoke(params, (err, data) => {
  if (err) {
    logError("Error running UpdateItemLambdaFunction", err)
  } else {
    logSuccess(
      "Success running UpdateItemLambdaFunction",
      JSON.parse(data.Payload)
    )
  }
})
