import { Request, Response } from 'express';
//import { parseDatabaseError } from '../utils/db-utils';
import { createLinkId, createNewLink, updateLinkVisits, getLinksByUserId, getLinksByUserIdForOwnAccount, deleteLink } from '../models/LinkModel';
import { getUserByID, getLinkByID } from '../models/UserModel';
import { Link } from "../entities/Link";

const { PORT } = process.env;

async function shortenUrl(req: Request, res: Response): Promise<void> {

    if (!req.session.isLoggedIn) {
        res.redirect(`http://localhost:${PORT}/login`);
        return;
    }

    // Get the userId from `req.session`
    const userId = req.session.authenticatedUser.userId;

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

    const { originalUrl } = req.body as linkURL;

    // Generate a `linkId`
    const linkId = await createLinkId(originalUrl, userId);
    // Add the new link to the database (wrap this in try/catch)
    // Respond with status 201 if the insert was successful

    try {
        const newLink = await createNewLink(originalUrl, linkId, thisUser);
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

    const { targetUserId } = req.params as returnedUser;
    const { isLoggedIn, authenticatedUser } = req.session;

    let link = null;

    if (!isLoggedIn) {

        res.sendStatus(401);
        return link;

    }

    try {

        if (authenticatedUser.isAdmin) {

            link = await getLinksByUserIdForOwnAccount(targetUserId);
            res.status(200).json(link);
            return link;

        } else {

            link = await getLinksByUserId(targetUserId);
            res.status(200).json(link);
            return link;

        }

    } catch (err) {

        console.error(err);
        res.sendStatus(500);
        return link;

    }

}

async function deletingLinkById(req: Request, res: Response): Promise<void> {

    const { targetUserId, targetLinkId } = req.params as linkIdSearch;
    const { isLoggedIn, authenticatedUser } = req.session;
    const link = await getLinkByID(targetLinkId);
    console.log(link);

    if (!isLoggedIn) {
        res.sendStatus(401);
        return;
    }

    if ((authenticatedUser.isAdmin === true) || (authenticatedUser.userId === targetUserId)) {

        await deleteLink(link.linkId);
        res.status(200).json("The link was deleted.");
        return;

    } else {

        res.sendStatus(403).json("You are not authorized.");
        return;

    }

    return;

}

export { shortenUrl, getOriginalUrl, returningLinkToUser, deletingLinkById };