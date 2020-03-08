const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    favoriteStreams: [{
        type: Schema.Types.ObjectId,
        ref: "Favorite",
        unique: true
    }]
});

module.exports = mongoose.model("User", userSchema);
