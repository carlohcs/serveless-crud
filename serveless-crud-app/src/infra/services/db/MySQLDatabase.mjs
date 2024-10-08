import mysql from "mysql2/promise"

export class MySQLDatabase {
  static instance

  constructor() {
    if (MySQLDatabase.instance) {
      return MySQLDatabase.instance
    }

    MySQLDatabase.instance = this
  }

  static async getInstance() {
    if (!MySQLDatabase.instance) {
      MySQLDatabase.instance = new MySQLDatabase()
      await MySQLDatabase.instance.init()
    }

    return MySQLDatabase.instance
  }

  async init() {
    try {
      // Avoid we having to import the mysql2 package in the main file (node_modules)
      // const mysql = await import("https://cdn.skypack.dev/mysql2/promise");
      this.connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      })

      console.info("Connected to the database!")
    } catch (error) {
      console.error("Error when connecting to the database:", error)
    }
  }
}
