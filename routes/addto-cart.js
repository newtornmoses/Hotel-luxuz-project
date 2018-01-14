const express = require('express');
const router = express.Router();
const Cart = require('../models/mycart');
const shop = require('../models/shop');



//view cart


router.get('/shopping_cart', (req, res) => {

    if (!req.session.cart) {
        res.render('shopping_cart', { shop: null })
    } else {
        var cart = new Cart(req.session.cart);


        res.render('shopping_cart', { shop: cart.generateArray(), cart, totalprice: cart.totalprice })
    }



});


//addto-cart

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    shop.findById({ _id: id }, (err, shopcart) => {



        if (shopcart) {
            cart.addTocart(shopcart, shopcart.id);
            req.session.cart = cart;
            req.flash('success', 'successfully added' + ' ' + cart.items[id].item.title);
            res.redirect('/hotelluxuz/shop');
            console.log(cart.generateArray());
        }
    });


});


//reducebyone

router.get('/reduceOne/:id', (req, res) => {
    const id = req.params.id;
    const cart = new Cart(req.session.cart);
    shop.findById({ _id: id }, (err, shopcart) => {

        if (shopcart) {

            cart.reduceOne(id);
            req.session.cart = cart;


            res.redirect('/hotelluxuz/shop/cart/shopping_cart')
        }

    })
});



//increment items

router.get('/additems/:id', (req, res) => {
    const id = req.params.id;
    const cart = new Cart(req.session.cart);

    shop.findById({ _id: id }, (err, shop) => {
        if (shop) {
            cart.additems(id);
            req.session.cart = cart;
            res.redirect('/hotelluxuz/shop/cart/shopping_cart');
        }
    })
});


//remove entire group of items


router.get('/removegroup/:id', (req, res) => {
    const id = req.params.id;
    shop.findById({ _id: id }, (err, shop) => {
        if (shop) {
            const cart = new Cart(req.session.cart);

            cart.removeall(id);
            req.session.cart = cart;
            res.redirect('/hotelluxuz/shop/cart/shopping_cart');
        }


    })
});










module.exports = router;