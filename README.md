<hr>

<div align="center">

<h1 align="center">serveless-crud</h1>

</div>

<pre align="center">Serverless CRUD API on AWS Lambda, API Gateway, and RDS MySQL, deployed with AWS SAM.</pre>

[![GitHub](https://img.shields.io/badge/github-carlohcs%2Fserveless-crud-181717?logo=github)](https://github.com/carlohcs/serveless-crud)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-339933?logo=nodedotjs)](https://nodejs.org/)
[![AWS SAM](https://img.shields.io/badge/AWS-SAM-FF9900?logo=amazonaws)](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html)
[![SLIM](https://img.shields.io/badge/Best%20Practices%20from-SLIM-blue)](https://nasa-ammos.github.io/slim/)

[Issue Tracker](https://github.com/carlohcs/serveless-crud/issues)

This repository is a learning project for a serverless CRUD application. The original challenge was to expose create, read, update, and delete operations through AWS Lambda, deploy with AWS Serverless Application Model (SAM), authenticate with Amazon Cognito, and publish the functions as REST endpoints via Amazon API Gateway.

The implemented application lives in [`serveless-crud-app/`](serveless-crud-app/). It deploys Node.js 20 Lambda functions behind API Gateway, a VPC, and an Amazon RDS MySQL instance. Handlers persist users in MySQL (`mysql2`). Cognito is documented as the intended authorizer for the challenge; wiring it in production still requires API Gateway authorizer configuration (see [FAQ](#frequently-asked-questions-faq)).

A short local-run recording is available at [`running-lambda.mp4`](running-lambda.mp4).

SAM-generated starter notes (IDE toolkits, `sam logs`, cleanup) remain in [`serveless-crud-app/README.md`](serveless-crud-app/README.md).

## Features

* REST CRUD for a `users` table: list, get by id, create, update, and delete
* Extra endpoint to create the `users` table (`GET /create-users-table`)
* AWS SAM template for Lambda, API Gateway, VPC, security groups, and RDS MySQL
* Local API emulation with `sam local start-api` (Docker required)
* npm trigger scripts to invoke handlers from the command line
* Jest unit tests under `serveless-crud-app/__tests__`
* Optional CodeBuild packaging via `buildspec.yml`

## Contents

* [Quick Start](#quick-start)
* [API](#api)
* [Configuration](#configuration)
* [Changelog](#changelog)
* [FAQ](#frequently-asked-questions-faq)
* [Contributing](#contributing)
* [License](#license)
* [Support](#support)

## Quick Start

This guide gets the sample running locally and on AWS. Application source, `template.yaml`, and npm scripts are in `serveless-crud-app/`.

### Requirements

* [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) (macOS: `brew tap aws/tap` then `brew install aws-sam-cli`)
* [Node.js 20+](https://nodejs.org/en/) and npm
* [Docker](https://hub.docker.com/search/?type=edition&offering=community) for `sam local` (API and function emulation)
* AWS CLI credentials (this repo’s `samconfig.toml` uses profile `academy` and region `us-east-1`)
* An IAM role Lambda can assume. `template.yaml` currently pins `Role: arn:aws:iam::520138362070:role/LabRole` — replace it with a role in your account before deploy

### Setup Instructions

1. Clone the repository.

   ```bash
   git clone https://github.com/carlohcs/serveless-crud.git
   cd serveless-crud/serveless-crud-app
   ```

2. Install production dependencies used in the Lambda zip (either form works):

   ```bash
   npm install --omit=dev
   # or
   npm install --only=prod
   ```

   For tests and local tooling, run `npm install` so `devDependencies` (Jest, AWS SDK mocks) are included.

3. Validate the SAM template:

   ```bash
   sam validate
   ```

4. Review `template.yaml` parameters (`Environment`, `DBInstanceIdentifier`, `DBName`, `DBUser`, `DBPassword`) and the hardcoded Lambda `Role`. Change the database password from the template default before any shared or production deploy.

### Run Instructions

**Build and deploy to AWS**

```bash
sam build
sam deploy --guided
# sam deploy --guided --profile academy
```

After the first guided deploy, later deploys can be `sam deploy` if settings were saved to `samconfig.toml`.

Convenience scripts in `package.json`:

```bash
npm run build          # sam build --no-cached
npm run deploy         # bash deploy.sh
npm run build:deploy   # build then deploy
```

`deploy.sh` writes a stack name into `samconfig.toml` and runs `sam deploy` with `--profile academy`. To avoid CloudFormation name collisions, you can deploy with a unique stack name:

```bash
STACK_NAME="serveless-crud-app-$(uuidgen)"
sam deploy --template-file template.yaml --stack-name $STACK_NAME --capabilities CAPABILITY_IAM --profile academy
```

**Run the API locally**

Enable Docker, then:

```bash
sam local start-api --profile <profile>
```

Expected console output looks like:

```text
Containers Initialization is done.
Mounting GetAllItemsLambdaFunction at http://127.0.0.1:3000/ [GET]
Mounting DeleteItemLambdaFunction at http://127.0.0.1:3000/{id} [DELETE]
Mounting GetByIdLambdaFunction at http://127.0.0.1:3000/{id} [GET]
Mounting CreateItemLambdaFunction at http://127.0.0.1:3000/ [POST]
Mounting CreateTableLambdaFunction at http://127.0.0.1:3000/create-users-table [GET]
Mounting UpdateItemLambdaFunction at http://127.0.0.1:3000/{id} [PUT]
```

Call those URLs with curl, a browser (GET), or an HTTP client. AWS SAM CLI local API docs: [Start an API locally](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-start-api.html).

**Invoke functions without the HTTP API**

From `serveless-crud-app/`:

| Action | Command |
| --- | --- |
| Create table | `npm run create:table` |
| List users | `npm run get:all` |
| Get by id | `npm run get:id -- "<id>"` |
| Create | `npm run create -- "<name>"` |
| Update | `npm run update -- "<id>" "<name>"` |
| Delete | `npm run delete -- "<id>"` |

Example of `npm run get:all` running against a local Lambda:

<video src="running-lambda.mp4" controls width="100%" title="npm run get:all invoking a local Lambda">
  <a href="running-lambda.mp4">Watch the recording of npm run get:all</a>
</video>

Local Node entry (replace placeholders):

```bash
npm start
# expands to:
# DB_TYPE=mysql DB_HOST=<DB_HOST> DB_USER=<DB_USER> DB_PASSWORD=<DB_PASSWORD> DB_NAME=<DB_NAME> node --experimental-vm-modules ./src/index.mjs
```

### Usage Examples

After deploy, test through API Gateway (REST), the Lambda console, the AWS CLI, or an SDK. Authenticated routes need a Cognito token once the authorizer is attached.

**AWS Management Console**

1. Open the AWS Lambda console.
2. Select the function.
3. Choose **Test**.
4. Configure a test event (sample or custom JSON).
5. Choose **Test** again to invoke.

**AWS CLI**

```bash
aws lambda invoke --function-name DeleteItemLambdaFunction --payload '{"id": "123"}' response.json
```

* `--function-name`: Lambda function name
* `--payload`: JSON input
* `response.json`: file that stores the response

**AWS SDK (Python / Boto3)**

```python
import boto3
import json

client = boto3.client("lambda")
payload = {"id": "123"}
response = client.invoke(
    FunctionName="DeleteItemLambdaFunction",
    InvocationType="RequestResponse",
    Payload=json.dumps(payload),
)
print(json.loads(response["Payload"].read()))
```

**AWS SDK (Node.js)**

```javascript
const AWS = require("aws-sdk");
const lambda = new AWS.Lambda();

const params = {
  FunctionName: "DeleteItemLambdaFunction",
  Payload: JSON.stringify({ id: "123" }),
};

lambda.invoke(params, (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(JSON.parse(data.Payload));
  }
});
```

### Build Instructions

SAM packages code from `CodeUri: ./` for each function.

```bash
cd serveless-crud-app
sam build
# or
npm run build
```

CI packaging (`buildspec.yml`): install deps, run tests, prune `devDependencies`, then `aws cloudformation package` against `template.yaml`.

### Test Instructions

```bash
cd serveless-crud-app
npm install
npm run test
```

Tests live in `__tests__/`. Jest is configured for `.mjs` modules.

## API

Routes from the SAM function events (and `sam local start-api` mounts):

| Method | Path | Lambda |
| --- | --- | --- |
| `GET` | `/create-users-table` | `CreateTableLambdaFunction` |
| `GET` | `/` | `GetAllItemsLambdaFunction` |
| `POST` | `/` | `CreateItemLambdaFunction` |
| `GET` | `/{id}` | `GetByIdLambdaFunction` |
| `PUT` | `/{id}` | `UpdateItemLambdaFunction` |
| `DELETE` | `/{id}` | `DeleteItemLambdaFunction` |

CloudFormation outputs include the API Gateway base URL (`MyServerlessApi`) and the RDS endpoint (`MyDBInstanceEndpoint`).

## Configuration

**SAM / CloudFormation parameters** (`template.yaml`): `Environment` (`dev` \| `prod`), `DBInstanceIdentifier`, `DBName`, `DBUser`, `DBPassword`.

**Lambda environment variables:** `TABLE_NAME` (`users`), `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_TYPE` (`mysql`).

**`samconfig.toml`:** stack name, `us-east-1`, profile `academy`, `CAPABILITY_IAM`, `parameter_overrides` for environment and DB identifiers.

**IAM:** functions use a lab `LabRole` ARN. On a paid account you can instead create a `LambdaExecutionRole` (commented in the template) with RDS and VPC permissions.

## Changelog

This repository does not ship a `CHANGELOG.md`. See [GitHub commits](https://github.com/carlohcs/serveless-crud/commits) and [releases](https://github.com/carlohcs/serveless-crud/releases) for history.

## Frequently Asked Questions (FAQ)

1. **SAM asks: `CreateTableLambdaFunction` has no authentication. Is this okay?**
   - For local labs it may be acceptable. For a protected API, add a Cognito user-pool authorizer on API Gateway, for example:

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

2. **How do I tear down a failed or unused stack?**

   ```bash
   aws cloudformation delete-stack --stack-name serveless-crud-app --profile academy
   aws cloudformation wait stack-delete-complete --stack-name serveless-crud-app --profile academy
   ```

   If you used another stack name (for example from `deploy.sh` or `uuidgen`), pass that name instead.

3. **`Execution failed due to configuration error: Invalid permissions on Lambda function`**
   - Grant API Gateway permission to invoke the function. Replace names, statement ids, and ARNs with values from your account:

   ```bash
   aws lambda add-permission \
     --function-name GetByIdLambdaFunction \
     --statement-id random-id-01 \
     --action lambda:InvokeFunction \
     --principal apigateway.amazonaws.com \
     --source-arn arn:aws:execute-api:us-east-1:<account-id>:<api-id>/* \
     --profile academy
   ```

   Repeat for each function if needed. Duplicate `statement-id` values cause errors; use a unique id per statement.

4. **I cannot edit code in the Lambda console**
   - The console inline editor only works for small packages (on the order of 3 MB). See [Lambda quotas](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html#limits-list). Use [Lambda layers](https://docs.aws.amazon.com/lambda/latest/dg/creating-deleting-layers.html) or keep editing in this repo and redeploy with SAM.

5. **`sam init` vs this repository**
   - You do not need `sam init` to use this project; the app already exists under `serveless-crud-app/`. `sam init` is only for scaffolding a new SAM app from scratch.

## Contributing

1. Open a [GitHub issue](https://github.com/carlohcs/serveless-crud/issues) describing the change.
2. [Fork](https://github.com/carlohcs/serveless-crud/fork) the repository.
3. Implement the change in your fork.
4. Open a pull request and request a review from the maintainer.

There is no `CONTRIBUTING.md` or `CODE_OF_CONDUCT.md` in this repository yet.

**Working on your first pull request?** See [How to Contribute to an Open Source Project on GitHub](https://kcd.im/pull-request).

## License

No `LICENSE` file is present in this repository. Add one before treating the project as open source with redistributable terms.

## Support

Maintainer: [carlohcs](https://github.com/carlohcs)

Questions and bugs: [GitHub Issues](https://github.com/carlohcs/serveless-crud/issues)
