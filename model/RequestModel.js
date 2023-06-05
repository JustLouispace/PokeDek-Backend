const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: true
    },
    slug: {
        type: String,
        required: false,
        lowercase: true,
    },
    supertype: {
        type: String,
        required: false
    },
    subtypes: {
        type: String,
        required: false
    },
    hp: {
        type: String,
        required: false
    },
    types: {
        type: String,
        required: false
    },
    evolvesFrom: {
        type: String,
    },
    images: [{
        public_id: String,
        url: String
    }],
});

module.exports = mongoose.model('Request', RequestSchema);

