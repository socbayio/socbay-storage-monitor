const { uploadBlock } = require('../models/uploadBlockModel');
const status = require('../crust-ipfs/status').default;
const IpfsHttpClient = require('ipfs-http-client');
const { globSource, create, CID } = IpfsHttpClient;
const { ipfsTimeout } = require('../ipfsconfig');

module.exports = async (req, res, next) => {
    const ipfs = create({
        timeout: ipfsTimeout
    });
    let listCid = [];
    for await (const { cid } of ipfs.pin.ls({
        type: 'recursive'
    })) {
        listCid.push(cid.toString());
    }

    const uploadBlockFound = await uploadBlock.find().select('_id uploadedToNetwork CID filesInfo removedFromLocalIpfs');
    for (let blockCount = 0; blockCount < uploadBlockFound.length; blockCount++){
        if (uploadBlockFound[blockCount].CID) {
            const statusObj = await status(uploadBlockFound[blockCount].CID);
            let objToUpload = {
                uploadedToNetwork: false,
                currentInfo: {}
            };

            if (statusObj[0].reported_replica_count > 3){
                objToUpload.uploadedToNetwork = true;
                objToUpload.currentInfo = {
                    expiredOnBlockHeight: statusObj[0].expired_on,
                    replicas: statusObj[0].reported_replica_count,
                }
                if (!uploadBlockFound[blockCount].removedFromLocalIpfs){
                    if(listCid.includes(uploadBlockFound[blockCount].CID)){
                        await ipfs.pin.rm(new CID(uploadBlockFound[blockCount].CID));
                    }
                    for (let fileCount = 0; fileCount < uploadBlockFound[blockCount].filesInfo.length; fileCount++) {
                        if(listCid.includes(uploadBlockFound[blockCount].filesInfo[fileCount].CID)){
                            await ipfs.pin.rm(new CID(uploadBlockFound[blockCount].filesInfo[fileCount].CID));
                        }
                    }
                    objToUpload.removedFromLocalIpfs = true;
                }
            }
            uploadBlock.findByIdAndUpdate(uploadBlockFound[blockCount]._id, objToUpload)
            .then()
        }
    }
};
