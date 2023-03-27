import { AppDataSource } from "../dataSource";
import { User } from "../entities/User";
import { Link } from "../entities/Link";

const userRepository = AppDataSource.getRepository(User);
const linkRepository = AppDataSource.getRepository(Link);

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

async function getUserByUsername(username: string): Promise<User | null> {
    // TODO: Get the user by where the username matches the parameter
    // This should also retrieve the `links` relation
    const user = await userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.link', 'link')
        .where('username = :username', { username})
        .getOne();

    return user;    

}

async function getUserByID(userId: string): Promise<User | null> {

    const user = await userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.link', 'link')
        .where('userId = :userId', { userId })
        .getOne();

    return user;    

}

async function getLinkByID(linkId: string): Promise<Link | null> {

    const link = await linkRepository
        .createQueryBuilder('link')
        .leftJoinAndSelect('link.user', 'user')
        .where('linkId = :linkId', { linkId })
        .getOne();

    return link;    

}

export {addNewUser, getUserByUsername, getUserByID, getLinkByID };