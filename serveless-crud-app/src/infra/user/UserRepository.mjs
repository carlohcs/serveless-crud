import { UserRepositoryInterface } from "../../core/user/UserRepositoryInterface.mjs"
import { DatabaseFactory } from "../services/DatabaseFactory.mjs"

export class UserRepository extends UserRepositoryInterface {
  constructor({ tableName }) {
    super()
    this.database = null
    this.tableName = tableName
  }

  async init() {
    this.database = await DatabaseFactory.createDatabase()
    console.log("UserRepository initialized.")
  }

  async createTable() {
    await this.database.connection.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )`
    )
  }

  async getAllItems() {
    const [rows] = await this.database.connection.execute(
      `SELECT * FROM ${this.tableName}`
    )
    return rows
  }

  async getById(id) {
    const [rows] = await this.database.connection.execute(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    )
    return rows[0]
  }

  async create({ name }) {
    const [result] = await this.database.connection.execute(
      `INSERT INTO ${this.tableName} (name) VALUES (?)`,
      [name]
    )
    return result.insertId
  }

  async update({ id, name }) {
    await this.database.connection.execute(
      `UPDATE ${this.tableName} SET name = ? WHERE id = ?`,
      [name, id]
    )
  }

  async delete(id) {
    await this.database.connection.execute(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    )
  }
}
