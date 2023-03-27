import { Request, Response } from 'express';
import { createLinkId, createNewLink } from '../models/LinkModel';
import { getUserByID } from '../models/UserModel';

async function shortenUrl(req: Request, res: Response): Promise<void> {

    const { originalUrl } = req.body as linkURL;
    const { isLoggedIn, authenticatedUser } = req.session;

    if(!isLoggedIn){
        res.sendStatus(401);
        return;
    }

    // Get the userId from `req.session`
    const userId = authenticatedUser.userId;

    // Retrieve the user's account data using their ID
    const thisUser = await getUserByID(userId);

    // Check if you got back `null`
        // send the appropriate response
    if(!thisUser){
        res.sendStatus(404);
        return;
    }
 
    // Check if the user is neither a "pro" nor an "admin" account
    if(thisUser.isPro === false && thisUser.isAdmin === false){
        // check how many links they've already generated
        const usersLinks = thisUser.link.length;
        // if they have generated 5 links
        if(usersLinks > 5){
            // send the appropriate response
            res.sendStatus(403);
            return;
        }
    }

    // Generate a `linkId`
    const linkId = await createLinkId(originalUrl, userId);
    // Add the new link to the database (wrap this in try/catch)
    // Respond with status 201 if the insert was successful

    try{
        console.log(originalUrl);
        const newLink = await createNewLink(originalUrl, linkId, thisUser);
        res.sendStatus(201).json(newLink);
        return;
    }catch(err){
        console.error(err);
        res.sendStatus(500);
        return;
    }

}

export { shortenUrl };