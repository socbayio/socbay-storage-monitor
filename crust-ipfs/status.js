const { ApiPromise, WsProvider } = require('@polkadot/api');
const { typesBundleForPolkadot } = require('@crustio/type-definitions');
const { parseObj } = require('./util');
const { chainAddr } = require('../ipfsconfig');
const logger = require('../logger').Logger;

module.exports = {
    default: async (cid) => {
        try {
            // 1. Try connect to Crust Network
            const chain = new ApiPromise({
                provider: new WsProvider(chainAddr),
                typesBundle: typesBundleForPolkadot
            });
            await chain.isReadyOrError;

            // 2. Query on-chain file data
            const maybeFileUsedInfo = parseObj(await chain.query.market.files(cid));
            if (maybeFileUsedInfo) {
                const replicaCount = maybeFileUsedInfo[0].reported_replica_count;
                if (replicaCount === 0) {
                    logger.crustSocbayPinner(`⚠️  ${cid} pending...`);
                } else {
                    logger.crustSocbayPinner(`✅  ${cid} picked, replicas: ${replicaCount}`);
                }
            } else {
                logger.crustSocbayPinner(`🗑  ${cid} not exist or expired`);
            }

            // 3. Disconnect with chain
            chain.disconnect();

            return maybeFileUsedInfo;
        } catch (e) {
            logger.error(`Query status failed with ${e}`);
        }
    }
}