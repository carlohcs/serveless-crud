import AWS from "aws-sdk"

// Workaround for AWS SDK issue
// const credentials = new AWS.SharedIniFileCredentials({
//   profile: "academy"
// })
// https://github.com/aws/aws-sdk-js/issues/3146#issuecomment-598602708
process.env["AWS_SDK_LOAD_CONFIG"] = 1

AWS.config.credentials = new AWS.SharedIniFileCredentials({
  profile: "academy"
})

const lambda = new AWS.Lambda()

export { lambda }
