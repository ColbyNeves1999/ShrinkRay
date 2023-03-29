import { Request, Response } from 'express';
import { createLinkId, createNewLink, updateLinkVisits, getLinksByUserId, getLinksByUserIdForOwnAccount } from '../models/LinkModel';
import { getUserByID, getLinkByID } from '../models/UserModel';
import { Link } from "../entities/Link";

async function shortenUrl(req: Request, res: Response): Promise<void> {

    const { originalUrl } = req.body as linkURL;
    const { isLoggedIn, authenticatedUser } = req.session;

    if (!isLoggedIn) {
        res.sendStatus(401);
        return;
    }

    // Get the userId from `req.session`
    const userId = authenticatedUser.userId;

    // Retrieve the user's account data using their ID
    const thisUser = await getUserByID(userId);

    // Check if you got back `null`
    // send the appropriate response
    if (!thisUser) {
        res.sendStatus(404);
        return;
    }

    // Check if the user is neither a "pro" nor an "admin" account
    if (thisUser.isPro === false && thisUser.isAdmin === false) {
        // check how many links they've already generated
        const usersLinks = thisUser.link.length;
        // if they have generated 5 links
        if (usersLinks > 5) {
            // send the appropriate response
            res.sendStatus(403);
            return;
        }
    }

    // Generate a `linkId`
    const linkId = await createLinkId(originalUrl, userId);
    // Add the new link to the database (wrap this in try/catch)
    // Respond with status 201 if the insert was successful

    try {
        console.log(originalUrl);
        const newLink = await createNewLink(originalUrl, linkId, thisUser);
        console.log(newLink);
        res.status(201).json(newLink);
        return;
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }

}

async function getOriginalUrl(req: Request, res: Response): Promise<void> {
    // Retrieve the link data using the targetLinkId from the path parameter
    const { targetLinkId } = req.params as linkId;
    const desiredLink = await getLinkByID(targetLinkId);

    // Check if you got back `null`
    if (!desiredLink) {
        // send the appropriate response
        res.sendStatus(403);
        return;
    }

    // Call the appropriate function to increment the number of hits and the last accessed date
    updateLinkVisits(desiredLink);
    // Redirect the client to the original URL
    res.redirect(301, desiredLink.originalUrl);
}

async function returningLinkToUser(req: Request, res: Response): Promise<Link[]> {

    let link = null;
    const { userId } = req.body as loggedUser;
    const { isLoggedIn, authenticatedUser } = req.session;

    if (!isLoggedIn) {

        res.sendStatus(401);
        return link;

    }

    try {
        if (authenticatedUser.isAdmin) {

            link = await getLinksByUserIdForOwnAccount(userId);
            res.sendStatus(201);
            return link;

        } else {

            link = await getLinksByUserId(userId);
            res.sendStatus(201);
            return link;

        }
    } catch (err) {

        console.error(err);
        res.sendStatus(500);
        return link;

    }

}

export { shortenUrl, getOriginalUrl, returningLinkToUser };