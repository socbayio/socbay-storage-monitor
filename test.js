const IpfsHttpClient = require('ipfs-http-client');
const { globSource, create, CID } = IpfsHttpClient;
const { ipfsTimeout } = require('./ipfsconfig');
const config = require('./config');


const checkBlock = require('./task/checkBlock');
const mongoose = require('mongoose');
mongoose.connect(config.dbServerUrl + 'socbay', config.userAuth);


const ipfs = create({
    timeout: ipfsTimeout
});

const removeFile = async () => {
    try {
        const ab = await ipfs.pin.rm(new CID('QmWMX4zpLEyn4VNtNSMTiz5A77iqs6WQoMU2jr52tmpM9H'));
        console.log(ab);
    } catch (e) {
        console.log(e)
    }
    
}

checkBlock();
//removeFile();


