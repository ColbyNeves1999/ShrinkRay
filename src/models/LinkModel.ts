import { createHash } from "crypto";

async function createLinkId(originalURL: string, userId: string): Promise<string>{

    const md5 = createHash('md5');
    md5.update(originalURL + userId);
    const urlHash = md5.digest('base64url');
    const linkId = urlHash.slice(0, 9);

    return linkId;

}

export {createLinkId};