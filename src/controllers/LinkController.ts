import { Request, Response } from 'express';
import { createLinkId, createNewLink } from '../models/LinkModel';
//import { parseDatabaseError } from '../utils/db-utils';
//import argon2 from 'argon2';

async function shortenUrl(req: Request, res: Response): Promise<void> {

    const { isLoggedIn, authenticatedUser } = req.session;

    if(!isLoggedIn){
        res.sendStatus(401);
        return;
    }

    // Get the userId from `req.session`
    const userId = authenticatedUser.userId;

    // Retrieve the user's account data using their ID
    // Check if you got back `null`
        // send the appropriate response

    // Check if the user is neither a "pro" nor an "admin" account
        // check how many links they've already generated
        // if they have generated 5 links
            // send the appropriate response
    
    // Generate a `linkId`
    // Add the new link to the database (wrap this in try/catch)
    // Respond with status 201 if the insert was successful

}

export { shortenUrl };