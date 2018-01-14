const express = require('express');
const router = express.Router();
require('dotenv/config');
const Cart = require('../models/mycart');
const stripe = require('stripe')(process.env.STRIPE_SECRETKEY);
const order = require('../models/order');

//get check out form

router.get('/form', (req, res) => {

    if (!req.session.cart) {
        res.redirect('/hotelluxuz/shop');
    } else {




        const cart = new Cart(req.session.cart ? req.session.cart : {});
        req.session.cart = cart;


        res.render('check_out', { totalprice: cart.totalprice });
    }
});





// stripe pay
router.post('/stripe', (req, res, next) => {
    const cart = new Cart(req.session.cart);
    const shops = cart.generateArray();
    if (!req.session.cart) {
        res.redirect('/hotelluxuz/shop');
    }
    //charge the customer with stripe
    stripe.charges.create({
        amount: cart.totalprice * 100,
        source: req.body.stripeToken,
        currency: 'usd',
        description: cart.items.title
    }, (err, charge) => {
        console.log(charge);
        const neworder = new order({

            userdetails: req.user,
            address: req.body.address,
            name: req.body.name,
            contact: req.body.phone1 + '-' + req.body.phone2 + '-' + req.body.phone3,
            paymentid: charge.id,
            currency: charge.currency,
            paid: charge.outcome.paid,
            source: charge.source.object,
            brand: charge.source.brand,
            status: charge.status,
            date: new Date(),
            items: cart.generateArray(),
            totalqty: req.session.cart.totalqty,
            totalprice: req.session.cart.totalprice

        });
        console.log(neworder.contact);

        //save order
        neworder.save((err, orders) => {


            //console.log(neworder);
            req.session.cart = null;
            req.flash('success', 'payment success thank you !!!');
            res.redirect('/hotelluxuz/shop/profile');




        });



    });

});

module.exports = router;