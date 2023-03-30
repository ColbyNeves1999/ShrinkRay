import { createHash } from "crypto";
import { AppDataSource } from "../dataSource";
import { User } from "../entities/User";
import { Link } from "../entities/Link";

const linkRepository = AppDataSource.getRepository(Link);

async function createLinkId(originalURL: string, userId: string): Promise<string>{

    const md5 = createHash('md5');
    md5.update(originalURL + userId);
    const urlHash = md5.digest('base64url');
    const linkId = urlHash.slice(0, 9);

    return linkId;

}

async function createNewLink (originalUrl: string, linkId: string, creator: User): Promise<Link> {
    // TODO: Implement me!
    let newLink = new Link();
    newLink.originalUrl = originalUrl;
    newLink.linkId = linkId;
    newLink.user = creator;

    newLink = await linkRepository.save(newLink);

    return newLink;

}

async function updateLinkVisits(link: Link): Promise<Link> {
    
    // Increment the link's number of hits property
    link.numHits = link.numHits + 1;
    // Create a new date object and assign it to the link's `lastAccessedOn` property.
    const now = new Date();
    link.lastAccessedOn = now;

    // Update the link's numHits and lastAccessedOn in the database
    link = await linkRepository.save(link);

    // return the updated link
    return link;

}

async function getLinksByUserId(userId: string): Promise<Link[]> {

    const links = await linkRepository
      .createQueryBuilder('link')
      .where({ user: { userId } }) // NOTES: This is how you do nested WHERE clauses
      .leftJoin('link.user', 'user')
      .select(['link.linkId', 'link.originalUrl', 'user.userId', 'user.username', 'user.isAdmin'])
      .getMany();
      
  
    return links;
}  

async function getLinksByUserIdForOwnAccount(userId: string): Promise<Link[]> {
  // TODO: This function is pretty much the same but it should return the fields 
  const links = await linkRepository
      .createQueryBuilder('link')
      .where({ user: { userId } }) // NOTES: This is how you do nested WHERE clauses
      .leftJoin('link.user', 'user')
      .select(['link.linkId', 'link.originalUrl', 'link.numHits', 'link.lastAccessedOn', 'user.userId', 'user.username', 'user.isPro', 'user.isAdmin'])
      .getMany();
      
  
    return links;
}

async function deleteLink(linkId: string): Promise<void>{

    await linkRepository
        .createQueryBuilder('link')
        .delete()
        .where('linkId = :linkId', {linkId})
        .execute();

    return;

}

export {createLinkId, createNewLink, updateLinkVisits, getLinksByUserId, getLinksByUserIdForOwnAccount, deleteLink };