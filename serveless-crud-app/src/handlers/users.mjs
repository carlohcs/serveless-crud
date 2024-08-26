import { UserRepository } from "../infra/user/UserRepository.mjs"

const userRepository = new UserRepository({
  tableName: process.env.TABLE_NAME
})

const log = (message) => {
  console.log(`[users-request] ${message}`)
}

const logResponse = (event, response) => {
  log(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  )
}

/**
 * A simple example includes a HTTP get method to get create 'users' table inside a database.
 * GET /create-users-table
 */
export const createTableHandler = async (event) => {
  let response = {
    statusCode: 500,
    body: {}
  }

  if (event.httpMethod !== "GET") {
    throw new Error(
      `createTable only accept GET method, you tried: ${JSON.stringify(event)}`
    )
  }

  try {
    await userRepository.init()
    await userRepository.createTable()
    response = {
      statusCode: 201,
      body: JSON.stringify({})
    }
  } catch (err) {
    log(`API Error: ${err}`)
    response.error = err.message
  }

  // All log statements are written to CloudWatch
  logResponse(event, response)

  return response
}

/**
 * A simple example includes a HTTP get method to get all items from a database's table.
 * GET /users
 */
export const getAllItemsHandler = async (event) => {
  let response = {
    statusCode: 500,
    body: {}
  }

  if (event.httpMethod !== "GET") {
    throw new Error(
      `getAllItems only accept GET method, you tried: ${JSON.stringify(event)}`
    )
  }

  try {
    await userRepository.init()
    const data = await userRepository.getAllItems()
    response = {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (err) {
    log(`API Error: ${err}`)
    response.error = err.message
  }

  // All log statements are written to CloudWatch
  logResponse(event, response)

  return response
}

/**
 * A simple example includes a HTTP get method to get one item from a database's table.
 * GET /users/{id}
 */
export const getByIdHandler = async (event) => {
  let response = {
    statusCode: 500,
    body: {}
  }

  if (event.httpMethod !== "GET") {
    throw new Error(
      `getById only accept GET method, you tried: ${JSON.stringify(event)}`
    )
  }

  try {
    const userId = event.pathParameters.id

    await userRepository.init()
    const data = await userRepository.getById(userId)

    response = {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (err) {
    log(`API Error: ${err}`)
    response.error = err.message
  }

  // All log statements are written to CloudWatch
  logResponse(event, response)

  return response
}

/**
 * A simple example includes a HTTP post method to add one item to a database's table.
 * POST /users
 */
export const createItemHandler = async (event) => {
  let response = {
    statusCode: 500,
    body: {}
  }

  if (event.httpMethod !== "POST") {
    throw new Error(
      `createItem only accept POST method, you tried: ${JSON.stringify(event)}`
    )
  }

  const body = JSON.parse(event.body)
  const name = body.name

  try {
    await userRepository.init()
    const userId = await userRepository.create({ name })
    response = {
      statusCode: 201,
      body: JSON.stringify({ userId })
    }
  } catch (err) {
    log(`API Error: ${err}`)
    response.error = err.message
  }

  // All log statements are written to CloudWatch
  logResponse(event, response)

  return response
}

/**
 * A simple example includes a HTTP put method to update one item to a database's table.
 * PUT /users/{id}
 */
export const updateItemHandler = async (event) => {
  let response = {
    statusCode: 500,
    body: {}
  }

  if (event.httpMethod !== "PUT") {
    throw new Error(
      `updateItem only accept PUT method, you tried: ${JSON.stringify(event)}`
    )
  }

  const body = JSON.parse(event.body)
  const id = event.pathParameters.id
  const name = body.name

  try {
    await userRepository.init()
    await userRepository.update({ id, name })
    response = {
      statusCode: 200,
      body: JSON.stringify({})
    }
  } catch (err) {
    log(`API Error: ${err}`)
    response.error = err.message
  }

  // All log statements are written to CloudWatch
  logResponse(event, response)

  return response
}

/**
 * A simple example includes a HTTP delete method to delete one item from a database's table.
 * DELETE /users/{id}
 */
export const deleteItemHandler = async (event) => {
  let response = {
    statusCode: 500,
    body: {}
  }

  if (event.httpMethod !== "DELETE") {
    throw new Error(
      `deleteItem only accept DELETE method, you tried: ${JSON.stringify(
        event
      )}`
    )
  }

  const userId = event.pathParameters.id

  try {
    await userRepository.init()
    await userRepository.delete(userId)
    response = {
      statusCode: 200,
      body: JSON.stringify({})
    }
  } catch (err) {
    log(`API Error: ${err}`)
    response.error = err.message
  }

  // All log statements are written to CloudWatch
  logResponse(event, response)

  return response
}

// Example to use in combination with API Gateway (/proxy+)
// /{proxy+}:
// x-amazon-apigateway-any-method:
//   x-amazon-apigateway-integration:
//     httpMethod: "POST"
//     type: "aws_proxy"
//     uri: !Sub arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${YourLambdaFunction.Arn}/invocations
//     passthroughBehavior: "when_no_match"
//     requestTemplates:
//       application/json: '{"statusCode": 200}'
//
// export const lambdaHandler = async (event) => {
//   let response = {
//     statusCode: 500,
//     body: {}
//   }

//   try {
//     switch (event.httpMethod) {
//       case 'GET':
//         if (event.path === '/users') {
//           response = await getAllItemsHandler(event)
//         } else if (event.path.startsWith('/users/')) {
//           const userId = event.path.split('/').pop()
//           response = await getItemHandler(event, userId)
//         } else {
//           response = {
//             statusCode: 404,
//             body: JSON.stringify({ message: 'Not Found' })
//           }
//         }
//         break
//       case 'POST':
//         if (event.path === '/users') {
//           response = await createItemHandler(event)
//         } else {
//           response = {
//             statusCode: 404,
//             body: JSON.stringify({ message: 'Not Found' })
//           }
//         }
//         break
//       // Adicione outros métodos HTTP conforme necessário
//       default:
//         response = {
//           statusCode: 405,
//           body: JSON.stringify({ message: `Method Not Allowed: ${event.httpMethod}` })
//         }
//     }
//   } catch (err) {
//     log(`API Error: ${err}`)
//     response = {
//       statusCode: 500,
//       body: JSON.stringify({ message: err.message })
//     }
//   }

//   // All log statements are written to CloudWatch
//   logResponse(event, response)

//   return response
// }
