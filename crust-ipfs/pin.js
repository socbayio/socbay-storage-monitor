const fs = require('fs');
const IpfsHttpClient = require('ipfs-http-client');
const { globSource, create } = IpfsHttpClient;
//const { ipfsTimeout } = require('./consts');
const { ipfsTimeout } = require('../ipfsconfig');
const { parseObj } = require('./util');
const logger = require('../logger').Logger;

module.exports = { 
    default: async (path) => {
        try {
            
            let returnObj = {};
            // 1. Check local ipfs is alive
            const ipfs = create({
                timeout: ipfsTimeout
            });

            // 2. Check legality of path
            if (!fs.existsSync(path)) {
                logger.crustSocbayPinner(`Error: File/directory is not exists: ${path}`)
                return;
            }
            // 3. Pin it
            const { cid } = await ipfs.add(globSource(path, { recursive: true }));

            // 4. Check local pin
            if (cid) {
                logger.crustSocbayPinner(`Pin success: ${cid}`);
                const objInfo = parseObj(await ipfs.object.stat(cid));
                const fileSize = objInfo.CumulativeSize;
                returnObj = { 
                    cid: cid.toString(), 
                    fileSize 
                };
            } else {
                logger.crustSocbayPinner(`Error: Pin failed, please try it again`)
            }

            // 5. Return file info
            return returnObj;
        } catch (e) {
            logger.crustSocbayPinner(`Error: IPFS is offline, please start it over, error detail: ${e}`);
        }
    }
}