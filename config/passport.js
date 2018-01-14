const passport = require('passport');
const Localstrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

const User = require('../models/users');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});


passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    })
});


//signup

passport.use('local.signup', new Localstrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true

}, function(req, email, password, done) {
    // vlidate input
    req.checkBody('email', 'invalid email').isEmail().notEmpty();
    req.checkBody('password', 'password must be 8 characters or more').notEmpty().isLength({ min: 8 });
    //req.checkBody('c_password', 'passwords dont match').isEqual(password);

    var errors = req.validationErrors();

    if (errors) {
        var messages = []
        errors.forEach((error) => {
            messages.push(error.msg);

        });
        return done(null, false, req.flash('error', messages))
    }


    User.findOne({ 'email': email }, function(err, user) {
        if (err) {
            return done(null, false, { message: 'something went wrong' });
        }
        if (user) {
            return done(null, false, { message: 'user already exists' });
        }
        const newuser = new User();
        newuser.username = req.body.username;
        newuser.email = req.body.email;
        newuser.password = newuser.encryptpassword(req.body.password);

        newuser.save((err, user) => {
            if (err) {
                res.redirect('/users/signup');
            }
            console.log(user);
            req.flash('success', 'successfully registered plz login to continue')
            return done(null, user);
        });
    });
}));


//login user

passport.use('local_login', new Localstrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true

}, (req, email, password, done) => {
    User.findOne({ 'email': email }, (err, user) => {
        if (err) {
            return done(null, false, { message: 'something went wrong' });
        }
        if (!user) {
            req.flash('message', 'no found user');
            return done(null, false, { message: 'no found user' });
        }
        if (!user.comparepassword(password)) {
            return done(null, false, { message: 'Wrong password' });
        }
        return done(null, user);
    });

}));