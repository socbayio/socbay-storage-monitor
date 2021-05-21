const { uploadBlock } = require('../models/uploadBlockModel');
const status = require('../crust-ipfs/status').default;
const IpfsHttpClient = require('ipfs-http-client');
const { globSource, create, CID } = IpfsHttpClient;
const { ipfsTimeout } = require('../ipfsconfig');


module.exports = async (req, res, next) => {
    const ipfs = create({
        timeout: ipfsTimeout
    });

    const uploadBlockFound = await uploadBlock.find().select('_id uploadedToNetwork CID');
    for (let blockCount = 0; blockCount < uploadBlockFound.length; blockCount++){
        if (uploadBlockFound[blockCount].CID) {
            const statusObj = await status(uploadBlockFound[blockCount].CID);
            let objToUpload = {
                uploadedToNetwork: false,
                currentInfo: {}
            };
            
            if (statusObj[0].reported_replica_count > 5){
                objToUpload.uploadedToNetwork = true;
                objToUpload.currentInfo = {
                    expiredOnBlockHeight: statusObj[0].expired_on,
                    replicas: statusObj[0].reported_replica_count,
                }
                if (!uploadBlockFound[blockCount].removedFromLocalIpfs){
                    const cidObj = new CID(uploadBlockFound[blockCount].CID);
                    let existed = false;
                    for await (const pin of ipfs.pin.ls({
                        paths: cidObj,
                        types: 'recursive'
                    })) {
                        if (cidObj.equals(pin.cid)) existed = true;
                    }
                    if (existed) {
                        await ipfs.pin.rm(cidObj);
                        objToUpload.removedFromLocalIpfs = true;
                    }
                }
            }
            uploadBlock.findByIdAndUpdate(uploadBlockFound[blockCount]._id, objToUpload)
            .then()
        }
    }
};
