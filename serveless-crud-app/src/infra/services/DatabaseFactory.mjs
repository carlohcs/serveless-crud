// import { DynamoDBDatabase } from './db/DynamoDBDatabase.mjs';
import { MySQLDatabase } from "./db/MySQLDatabase.mjs"

export class DatabaseFactory {
  static async createDatabase() {
    switch (process.env.DB_TYPE) {
      case "mysql":
        return await MySQLDatabase.getInstance()
      case "dynamodb":
        // return new DynamoDBDatabase()
        throw new Error("DynamoDB is not implemented yet")
      default:
        return await MySQLDatabase.getInstance()
    }
  }
}
