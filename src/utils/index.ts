import * as crypto  from 'crypto';



export function md5(content: string) {
  let md5 = crypto.createHash('md5');
  return md5.update(content).digest('hex');
}

export const encodePassword = (password: string, SECRET_KEY: string) => {
  const str = `password=${password}&key=${SECRET_KEY}`;
  return md5(str);
}

export const getJwtExp = () => {
  return Math.floor(new Date().getTime() / 1000 + 2 * 24 * 60 * 60);
}

export const getDomainFromUrl = (url: string) => {
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)
  const domain = (matches && matches[0]) || ''
  if (/\/$/.test(domain)) {
    return domain
  } else {
    return domain + '/'
  }
}