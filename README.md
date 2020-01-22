# Experimenting with Mongoose Hooks

Found a nice use case to use the `save` hook event before saving the document to hash the password and then store it.

```
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
```