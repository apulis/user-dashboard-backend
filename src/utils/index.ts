import * as crypto  from 'crypto';



export function md5(content: string) {
  let md5 = crypto.createHash('md5');
  return md5.update(content).digest('hex');
}



export const encodePassword = (password: string, SECRET_KEY: string) => {
  const str = `password=${password}&key=${SECRET_KEY}`;
  return md5(str);
}