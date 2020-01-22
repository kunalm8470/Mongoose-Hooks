const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 5;

const userSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    userName: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true, versionKey: false });

userSchema.pre('save', function(next){
    
    const user = this;

    // Guard check to determine if password field already hashed, if yes then don't hash again
    if (!this.isModified('password')) {
        return next();
    }

    return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if (err) {
            return next(err);
        } 

        return bcrypt.hash(user.password, salt, function(err, hash){
            
            if (err) {
                return next(err);
            }

            user.password = hash;
            return next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) {
            return callback(err);
        }

        return callback(null, isMatch);
    });
};

module.exports = mongoose.model('UserModel', userSchema, 'users');
