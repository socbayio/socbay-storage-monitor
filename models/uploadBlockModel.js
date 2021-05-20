const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subFileSchema = new Schema({
    fileName: String,
    fileSizeInByte: Number,
    CID: String,
    timestamp: {
        type: Number,
        default: Date.now,
    },
});

const uploadBlockSchema = new Schema({
    blockNumber: {
        type: Number,
        unique: true,
    },
    CID: String,
    timeStamp: Number,
    uploadedBy: Number,
    uploadedFilesNumber: Number,
    totalSizeInByte: {
        type: Number,
        default: 0
    },
    orderFee: Number,
    currentInfo: {
        expiredOnBlockHeight: Number,
        expiredOnDate: Date,
        replicas: Number,
        status: String,
        renewPoolBalance: Number,
    },
    filesInfo: [subFileSchema],
    uploadedToNetwork: {
        type: Boolean,
        default: false,
    },
});


const uploadBlock = mongoose.model('uploadBlock', uploadBlockSchema);
const subFile = mongoose.model('subFile', subFileSchema);
module.exports = { uploadBlock, subFile };
