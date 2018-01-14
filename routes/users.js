const express = require('express');
const passport = require('passport');
const router = express.Router();

//get users
router.get('/login', (req, res) => {


    res.render('login');
});


router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: ('/hotelluxuz/users/login'),
    failureRedirect: ('/hotelluxuz/users/signup'),
    failureFlash: true

}));


// login

router.post('/login', passport.authenticate('local_login', {
    successRedirect: ('/hotelluxuz/shop'),
    failureRedirect: ('/hotelluxuz/users/login'),
    failureFlash: true
}));


//logout
router.get('/logout', (req, res) => {

    req.logout();

    res.redirect('back');
})


module.exports = router;