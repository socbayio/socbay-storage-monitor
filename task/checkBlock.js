const { uploadBlock } = require('../models/uploadBlockModel');
const status = require('../crust-ipfs/status').default;

module.exports = async (req, res, next) => {
    const uploadBlockFound = await uploadBlock.find().select('_id uploadedToNetwork CID');;
    for (let blockCount = 0; blockCount < uploadBlockFound.length; blockCount++){
        if (uploadBlockFound[blockCount].CID) {
            const statusObj = await status(uploadBlockFound[blockCount].CID);
            let uploadedToNetwork = false;
            let currentInfo = {};
            if (statusObj[0].reported_replica_count > 5){
                uploadedToNetwork = true;
                currentInfo = {
                    expiredOnBlockHeight: statusObj[0].expired_on,
                    replicas: statusObj[0].reported_replica_count,
                }
            }
            uploadBlock.findByIdAndUpdate(uploadBlockFound[blockCount]._id, {uploadedToNetwork, currentInfo})
            .then()
        }
    }
};
