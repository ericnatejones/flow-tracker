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
// pre-save hook to encrypt user passwords on signup
userSchema.pre("save", function(next){
    const user = this
    if(!user.isModified("password")) return next()
        bcrypt.hash(user.password, 10, (err, hash) => {
            if(err) return next(err)
            user.password = hash
            next()
})
})

// method to check encrypted password on login
userSchema.methods.checkPassword = function(passwordAttempt, callback){
    bcrypt.compare(passwordAttempt, this.password, (err, isMatch) => {
        if(err) return callback(err)
        return callback(null, isMatch)
    })
}

// method to remove user's password for token/sending the response
userSchema.methods.withoutPassword = function(){
    const user = this.toObject()
    delete user.password
    return user
}

module.exports = mongoose.model("User", userSchema);
