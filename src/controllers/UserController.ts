import { Request, Response } from 'express';
import { addNewUser, getUserByUsername } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';
import argon2 from 'argon2';

async function registerUser(req: Request, res: Response): Promise<void> {
    // TODO: Implement the registration code
    // Make sure to check if the user with the given username exists before attempting to add the account
    // Make sure to hash the password before adding it to the database
    // Wrap the call to `addNewUser` in a try/catch like in the sample code

    const { username, password } = req.body as incomingUser;
    const user = await getUserByUsername(username);

    if(user){
        res.sendStatus(409);
    }

    // IMPORTANT: Hash the password
    const passwordHash = await argon2.hash(password);

    try {
        // IMPORTANT: Store the `passwordHash` and NOT the plaintext password
        const newUser = await addNewUser(username, passwordHash);
        console.log(newUser);
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        const databaseErrorMessage = parseDatabaseError(err);
        res.status(500).json(databaseErrorMessage);
    }
    
}

async function login(req: Request, res: Response): Promise<void> {

    const { username, password } = req.body as incomingUser;
    const user = await getUserByUsername(username);

    if(!user){
        console.log("HEEREERERE\n\n\n\n\n\n");
        res.sendStatus(403);
        return;
    }
    console.log("GEEEERRRRE\n\n\n\n\n\n");
    const { passwordHash } = user;

    if(!(await argon2.verify(passwordHash, password))) {
        res.sendStatus(403);
        return;
    }

    await req.session.clearSession();
    req.session.authenticatedUser = {
        userId: user.userId,
        isPro: user.isPro,
        isAdmin: user.isAdmin,
        username: user.username,
      };
    req.session.isLoggedIn = true;

    res.sendStatus(200);

}

export {registerUser, login};