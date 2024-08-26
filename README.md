# SERVELESS CRUD

## Challenge

Create a serverless CRUD application using AWS Lambda to handle create, read, update, and delete operations. Utilize AWS Serverless Application Model (SAM) for deployment, Amazon Cognito for authentication, and Amazon API Gateway to expose the Lambda functions as RESTful endpoints.

To set up AWS SAM, Amazon Cognito, and Amazon API Gateway for your serverless CRUD application, follow these steps:

### Step 1: Install AWS SAM CLI

```bash
brew tap aws/tap
brew install aws-sam-cli
```

### Step 2: Initialize a New AWS SAM Project

Create a new AWS SAM project:

```bash
sam init
```

Follow the prompts to select a template and runtime.

### Step 3: Define Your AWS SAM Template

Edit the `template.yaml` file to define your Lambda functions, API Gateway, and Cognito User Pool.

Generated file example:


```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: 'AWS::Serverless-2016-10-31'
Resources:
  UserPool:
    Type: AWS::Cognito::UserPool
    Properties:
      UserPoolName: MyUserPool

  UserPoolClient:
    Type: AWS::Cognito::UserPoolClient
    Properties:
      ClientName: MyUserPoolClient
      UserPoolId: !Ref UserPool

  ApiGateway:
    Type: AWS::Serverless::Api
    Properties:
      Name: MyApi
      Auth:
        DefaultAuthorizer: CognitoAuthorizer
        Authorizers:
          CognitoAuthorizer:
            UserPoolArn: !GetAtt UserPool.Arn

  CreateFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: src/create.handler
      Runtime: nodejs14.x
      Events:
        Api:
          Type: Api
          Properties:
            Path: /create
            Method: post
            RestApiId: !Ref ApiGateway

  ReadFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: src/read.handler
      Runtime: nodejs14.x
      Events:
        Api:
          Type: Api
          Properties:
            Path: /read
            Method: get
            RestApiId: !Ref ApiGateway

  UpdateFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: src/update.handler
      Runtime: nodejs14.x
      Events:
        Api:
          Type: Api
          Properties:
            Path: /update
            Method: put
            RestApiId: !Ref ApiGateway

  DeleteFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: src/delete.handler
      Runtime: nodejs14.x
      Events:
        Api:
          Type: Api
          Properties:
            Path: /delete
            Method: delete
            RestApiId: !Ref ApiGateway
```

### Step 4: Implement Lambda Functions

Create the Lambda function handlers in the `src` directory. For example, `create.js`:

```javascript
exports.handler = async (event) => {
  // Your create logic here
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Item created' }),
  };
};
```

### Step 5: Check if the file is fine

```bash
sam validate
```

### Step 6: Deploy the Application

Build and deploy your application using the AWS SAM CLI:

```bash
sam build
sam deploy --guided
# sam deploy --guided --profile academy (for specific aws profile)
```

(For this repository examples, run)

```bash
npm install --omit=dev
```

After, it can run only `sam deploy`

Follow the prompts to configure your deployment settings.

### Step 6: Test Your Endpoints

After deployment, you can test your endpoints using tools like Postman or curl. Ensure you have the necessary authentication tokens from Amazon Cognito.

#### Using the AWS Management Console

1. Go to the AWS Lambda Console.
2. Select the Lambda function you want to execute.
3. Click on "Test" at the top of the page.
4. Configure a test event (you can use a sample event or create a custom one).
5. Click "Test" again to execute the function.

#### Using the AWS CLI

You can use the `invoke` command from the AWS CLI to execute the Lambda function. Here is an example:

```bash
aws lambda invoke --function-name DeleteItemLambdaFunction --payload '{"id": "123"}' response.json
```

* `--function-name`: Name of the Lambda function.
* `--payload`: JSON with the input data for the function.
* `response.json`: File where the execution response will be saved.

#### Using the AWS SDK (Python)

Here is an example of how to invoke a Lambda function using the AWS SDK for Python (Boto3):

```python
import boto3
import json

# Create a Lambda client
client = boto3.client('lambda')

# Input Data for Lambda Function
payload = {
    "id": "123"
}

# Invoke the Lambda function
response = client.invoke(
    FunctionName='DeleteItemLambdaFunction',
    InvocationType='RequestResponse',
    Payload=json.dumps(payload)
)

# Read the response
response_payload = json.loads(response['Payload'].read())
print(response_payload)
```

#### Using the AWS SDK (Node.js)

Here is an example of how to invoke a Lambda function using the AWS SDK for Node.js:

```javascript
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

// Input Data for Lambda Function
const payload = {
  id: "123"
};

// Params to invoke Lambda function
const params = {
  FunctionName: 'DeleteItemLambdaFunction',
  Payload: JSON.stringify(payload)
};

// Invoke the Lambda function
lambda.invoke(params, (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(JSON.parse(data.Payload));
  }
});
```

### Through this repository

Install dependencies that will be created a zip from:

```bash
npm install --only=prod
```

* Create table

  ```bash
  npm run create:table
  ```

* Get all

  ```bash
  npm run get:all
  ```

* Get id

  ```bash
  npm run get:id -- "<id>"
  ```

* Create

  ```bash
  npm run create -- "<name>"
  ```

* Update

  ```bash
  npm run update -- "<id>" "<name>"
  ```

* Delete

  ```bash
  npm run delete -- "<id>"
  ```

### API Gateway

Since the endpoints are added into AWS API Gateway, we can access them directly as a REST API.

To run API locally [https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-start-api.html#:~:text=To%20start%20a%20local%20instance,and%20iterate%20over%20your%20functions.](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-start-api.html#:~:text=To%20start%20a%20local%20instance,and%20iterate%20over%20your%20functions.):

1. Enable Docker;
2. Run:

```bash
sam local start-api --profile <profile>
```

If everything is cool, you should see something like:

```bash
Containers Initialization is done.
Mounting GetAllItemsLambdaFunction at http://127.0.0.1:3000/ [GET]
Mounting DeleteItemLambdaFunction at http://127.0.0.1:3000/{id} [DELETE]
Mounting GetByIdLambdaFunction at http://127.0.0.1:3000/{id} [GET]
Mounting CreateItemLambdaFunction at http://127.0.0.1:3000/ [POST]
Mounting CreateTableLambdaFunction at http://127.0.0.1:3000/create-users-table [GET]
Mounting UpdateItemLambdaFunction at http://127.0.0.1:3000/{id} [PUT]
```

So we can hit those APIs with curl or with browser.

### Tips

_CreateTableLambdaFunction has no authentication. Is this okay? [y/N]:_

#### Solution

```yaml
MyCognitoAuthorizer:
  Type: AWS::ApiGateway::Authorizer
  Properties:
    Name: CognitoAuthorizer
    Type: COGNITO_USER_POOLS
    IdentitySource: method.request.header.Authorization
    RestApiId: !Ref ServerlessRestApi
    ProviderARNs:
      - !Sub arn:aws:cognito-idp:${AWS::Region}:${AWS::AccountId}:userpool/${CognitoUserPoolId}
```

_Some error happened. Remove stack_

```bash
aws cloudformation delete-stack --stack-name serveless-crud-app --profile academy
```

Verify if stack were removed:

```bash
aws cloudformation wait stack-delete-complete --stack-name serveless-crud-app --profile academy
```

__Execution failed due to configuration error: Invalid permissions on Lambda function_ 

```bash
aws lambda add-permission --function-name serveless-crud-app-GetByIdLambdaFunction-zrwjZeOIWA6Z --statement-id random-id-01 --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn arn:aws:iam::520138362070:role/LabRole --profile academy
```

or

```bash
aws lambda add-permission --function-name serveless-crud-app-GetAllItemsLambdaFunction-OE22TZ2B5hqs --statement-id random-id-03 --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn arn:aws:execute-api:us-east-1:520138362070:1lw8ew6ksj --profile academy
```

To avoid errors with duplication:

```
STACK_NAME="serveless-crud-app-$(uuidgen)"
sam deploy --template-file template.yaml --stack-name $STACK_NAME --capabilities CAPABILITY_IAM --profile academy
```

I can't see my code at console editor - limit of the zip it should be 3 MB:

[https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html#limits-list](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html#limits-list)

It's possible to work with Layers: [https://docs.aws.amazon.com/lambda/latest/dg/creating-deleting-layers.html](https://docs.aws.amazon.com/lambda/latest/dg/creating-deleting-layers.html
)