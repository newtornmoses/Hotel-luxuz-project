const express = require('express');
const router = express.Router();
const shop = require('../models/shop');
const Cart = require('../models/cart');
const order = require('../models/order');



//get api data
router.get('/', (req, res) => {
    shop.find((err, shop) => {
        if (err) {
            res.json(err);
        } else if (shop) {
            //res.json(shop);
            var user = req.user;
            res.render('home', { shop: shop, user });
        }

    });

});


// get profile

router.get('/profile', (req, res) => {

    var user = req.user;

    order.find({ userdetails: req.user }, (err, orders) => {
        if (err) {
            res.redirect('/shop');
        }



        res.render('profile', { orders: orders, user });
    });

});


//get edit form
router.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    shop.findById({ _id: id }, (err, shop) => {
        if (err) {
            res.json(err);
        } else if (shop) {
            //res.json(shop);
            res.render('shop_edit', { shop: shop });
        }

    });

});



//delete all

router.delete('/', (req, res) => {
    shop.remove((err, shop) => {
        if (err) {
            res.json(err);
        } else if (shop) {
            res.status(200).json({ msg: "successfully deleted all contents" });

        }

    });

});




//get a single doc

router.get('/:id', (req, res) => {
        const id = req.params.id;
        shop.findById({ _id: id }, (err, shop) => {
            if (err) {
                res.json(err);
            } else {

                res.render('singleproduct', { shop: shop });


            }
        })

    }


);

//update a single doc
router.post('/update/:id', (req, res) => {
    const id = req.params.id;

    const updatedform = {};
    updatedform.title = req.body.title;
    updatedform.image = req.body.image;
    updatedform.price = req.body.price;
    updatedform.description = req.body.description;

    shop.update({ _id: id }, { $set: updatedform }, (err, shop) => {
        if (err) {
            res.json(err)
        } else if (shop) {
            res.render('updateproduct', { shop: shop });
        }

    })



});







//post a doc
router.post('/', (req, res, next) => {
    const newshop = new shop;
    newshop.title = req.body.title;
    newshop.image = req.body.image;
    newshop.description = req.body.description;
    newshop.price = req.body.price;

    newshop.save((err, shop) => {
        if (err) {
            res.json({ error: 'bad data plz check your input' })
        } else {
            res.json({ msg: 'shop,successfully added to database', createdproduct: shop })
        }
    });

});


//delete asingle doc

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    shop.remove({ _id: id }, (err, shop) => {
        if (err) {
            res.json(err)
        } else {
            res.json({ msg: 'document successfully deleted' });
        }
    });
});

//edit a document
router.patch('/:id', (req, res) => {
    const id = req.params.id;
    const updateops = {};

    shop.update({ _id: id }, { $set: { email: req.body.email, password: req.body.password } }, (err, shop) => {
        if (err) {
            res.json(err)
        } else {
            res.json({ msg: 'document successfully updated' });
        }

    });
});




module.exports = router;