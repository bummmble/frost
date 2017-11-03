import { getHashDigest } from 'loader-utils';

const hashType = 'sha256';
const digestType = 'base62';
const digestLength = 4;

const generateHash = pkg => {
  return getHashDigest(JSON.stringify(pkg), hashType, digestType, digestLength);
};

export default (type, pkg, target, env) => {
  const hash = generateHash(pkg);
  return `.cache/${type}-${hash}-${target}-${env}`;
};
