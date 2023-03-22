import { AppDataSource } from "../dataSource";
import { User } from "../entities/User";

const userRepository = AppDataSource.getRepository(User);

async function getUserByUsername(username: string): Promise<User | null> {
    // TODO: Get the user by where the username matches the parameter
    // This should also retrieve the `links` relation
    const user = await userRepository
        .createQueryBuilder('user')
        .where('username === :getUser', { getUser: username})
        .select(['user.username', 'user.link'])
        .getOne();

    return user;    

}

async function addNewUser(username: string, passwordHash: string): Promise<User | null> {
    // TODO: Add the new user to the database
    let newUser = new User();
    newUser.username = username;
    newUser.passwordHash = passwordHash;

  // Then save it to the database
  // NOTES: We reassign to `newUser` so we can access
  // NOTES: the fields the database autogenerates (the id & default columns)
  newUser = await userRepository.save(newUser);

  return newUser;
}

export {addNewUser, getUserByUsername};