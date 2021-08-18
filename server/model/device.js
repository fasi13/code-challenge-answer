const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
    device: {
        type: String,
    },
    os: {
        type: String
    },
    manufacturer: {
        type: String
    },
    lastCheckedOutDate: {
        type: Date
    },
    lastCheckedOutBy: {
        type: String
    },
    isCheckedOut: {
        type: Boolean
    }
}, {timestamps: true});

const deviceModel = mongoose.model('device', DeviceSchema, 'Device');
module.exports = deviceModel;