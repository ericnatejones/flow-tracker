const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    stream: {
        type: Schema.Types.ObjectId,
        ref: "Stream",
    },
    upperParam: {type: Number, default: 100000},
    lowerParam: {type: Number, default: 0}
});

module.exports = mongoose.model("Favorite", favoriteSchema);
