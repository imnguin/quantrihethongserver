import crypto from 'crypto';

export const hashMD5 = (text) => {
    const md5Hash = crypto.createHash('md5');
    md5Hash.update(text, 'utf8');
    return md5Hash.digest('base64');
}