const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        require: true
    },
    fullname: {
        type: String,
        require: true
    },
    savedCollection: {
        type: Object,
    }, 
    bio: {
        type: String,
    },
    location: {
        type: String,
    },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

// https://github.com/saintedlama/passport-local-mongoose