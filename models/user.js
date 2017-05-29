var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,

    },
    userID: {
      type: Number
    },
    media: {
        type: {
            type: String,

        },
        accessToken: {
            type: String,

        },
    },
    stocks:[]
});

User = mongoose.model('User', UserSchema);

module.exports.User = User;
module.exports.Schema = UserSchema;