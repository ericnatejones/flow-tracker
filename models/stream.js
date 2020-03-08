const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const streamSchema = new Schema({
    apiTitle: {
        type: String,
        required: true
    },
    knownTitle: {
        type: String,
        default: this.apiTitle
    },
    apiId: {
        type: String,
        unique: true,
        required: true
    }
});

module.exports = mongoose.model("Stream", streamSchema);
