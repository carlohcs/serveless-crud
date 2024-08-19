import chalk from "chalk"

export const logSuccess = (msg, data) => {
  console.log(chalk.green(msg), data)
}

export const logError = (msg, error) => {
  console.error(chalk.red(msg), error)
}
