const User = require('../models/user.model');

const getNameCookie = (req, res) => {
    const currentPrincipal = req.cookies['currentPrincipal'];
    res.clearCookie('currentPrincipal', { httpOnly: true });
    return currentPrincipal;
};

exports.userLogin = function(req, res, next) {
    
    if (req.body && !req.body.userName) {
        return res.render('../views/error', { message: 'Username cannot be blank!'});
    }

    if (req.body && !req.body.password) {
        return res.render('../views/error', { message: 'Password cannot be blank!'});
    }

    User.findOne({ userName: req.body.userName})
    .exec((err, foundUser) => {
        
        if (err) {
            return next(err);
        }

        if (!foundUser) {
            return res.render('../views/error', { message: `No user with Username - ${req.body.userName} or Email - ${req.body.email} found!`});
        }

        foundUser.comparePassword(req.body.password, function(err, isMatch){
            if (err) {
                return next(err);
            }

            if (!isMatch) {
                return res.render('../views/error', { message: 'Entered password doesn\'t match!' });
            }

            res.cookie('currentPrincipal', foundUser.name, { httpOnly: true });
            return res.redirect('/home');
        });
    });
};

exports.userSignup = function(req, res, next) {
    
    if (req.body && !req.body.name) {
        return res.render('../views/error', { message: 'Name cannot be blank!'});
    }

    if (req.body && !req.body.userName) {
        return res.render('../views/error', { message: 'Username cannot be blank!'});
    }

    if (req.body && !req.body.email) {
        return res.render('../views/error', { message: 'Email cannot be blank!'});
    }

    if (req.body && !req.body.password) {
        return res.render('../views/error', { message: 'Password cannot be blank!'});
    }

    User.find({
        $or: [{userName: req.body.userName}, {email: req.body.email}]
    })
    .exec((err, data) => {
        
        if (err) {
            return next(err);
        }

        if (data && data.length) {
            return res.render('../views/error', { message: 'Username / Email already taken!'});
        }

        const newUser = new User({
            name: req.body.name,
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password
        });

        newUser.save()
               .then(data => {
                   
                    const { name } = data;
                    res.cookie('currentPrincipal', name, { httpOnly: true });
                    return res.redirect("/home");
               })
               .catch(next);
    });
    
};

exports.renderHomePage = function(req, res, next) {
    const currentPrincipal = getNameCookie(req, res);
    return res.render('../views/home', { name: currentPrincipal });
};

exports.renderLoginPage = function(req, res, next) {
    return res.render('../views/login');
};

exports.renderSignupPage = function(req, res, next) {
    return res.render('../views/signup');
};

exports.renderLogoutAction = function(req, res, next) {
    return res.redirect('/login');
};