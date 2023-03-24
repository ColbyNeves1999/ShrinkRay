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

export {createLinkId, createNewLink};