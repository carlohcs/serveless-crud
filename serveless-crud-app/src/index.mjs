import { UserRepository } from "./infra/user/UserRepository.mjs"
;(async () => {
  const userRepository = new UserRepository()
  await userRepository.init();

  try {
    console.info('Getting all users...')
    const usersFirst = await userRepository.getAllItems()
    console.log("All users", usersFirst)

    console.info('Creating user...')
    const userId = await userRepository.create({ name: "John Doe" })
    console.log("User created: ", userId)

    console.info('Getting user by id...')
    const user = await userRepository.getById(userId)
    console.log("User", user)

    console.info('Updating user...')
    await userRepository.update({ id: user.id, name: "Jane Doe" })

    console.info('Getting updated user...')
    const updatedUser = await userRepository.getById(user.id)
    console.log("Updated user", updatedUser)

    console.info('Deleting user...')
    await userRepository.delete(user.id)

    console.info('Getting all users...')
    const usersFinal = await userRepository.getAllItems()
    console.log("All users", usersFinal)

  } catch (err) {
    console.log("Error when running the queries", err)
  }

  return;
})()
