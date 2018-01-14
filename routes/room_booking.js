const express = require('express');
const router = express.Router();
require('dotenv/config');
const rooms = require('../models/rooms');
const User = require('../models/users');
const roomsOrder = require('../models/roomOrders');
const stripe = require('stripe')(process.env.STRIPE_SECRETKEY);
const nodemailer = require('nodemailer');
const moment = require('moment');





//get all rooms
router.get('/', (req, res, next) => {
    rooms.find((err, rooms) => {
        if (err) {
            res.json({ error: 'some thing went wrong' })
        }


        // get admin rights
        const user = req.user;
        if (user) {
            if (req.user.email === 'kingdomfilmz4x4@gmail.com') {
                req.user.isAdmin = true;


            } else {
                req.user.isAdmin = false;
            }

        }


        //room stats
        var rm = ' ';
        var bookedrooms = 0;
        var freerooms = 0;
        var active = '';
        var status;
        var notPaid = '';

        for (let i = 0; i < rooms.length; i++) {
            rm += rooms[i].isActive;
            bookedrooms += rooms[i].isActive;
            freerooms += rooms[i].isActive === false;
            notPaid += rooms[i].paid === false;


        }



        res.render('rooms', { data: rooms, rm, user, freerooms, bookedrooms, notPaid })
    });

});

// //get orders

router.get('/orders', (req, res) => {
    roomsOrder.find()
        .select()
        .populate('user ')
        .populate('rooms')
        .exec()
        .then(orders => res.json(orders))
        .catch(err => res.json({ msg: 'something went wrong' }))
});


//get active room

router.get('/free_rooms', (req, res) => {
    var type = ' Free';
    rooms.find({ isActive: false }, (err, room) => {
        if (err) {
            res.json("msg:something wrong happend")
        }

        //room stats
        var rm = ' ';
        var bookedrooms = 0;
        var freerooms = 0;
        var active = ' ';
        var showbtn = true;
        for (let i = 0; i < room.length; i++) {
            rm += room[i].isActive;
            bookedrooms += room[i].isActive === true;
            freerooms += room[i].isActive === false;


        }



        res.render('rooms', { data: room, rm, freerooms, type })


    });
});



//get room checkout form

router.get('/room/checkout/:id', (req, res, next) => {
    if (!req.session.price) {
        res.redirect('/hotelluxuz/hotel/rooms');
    }
    rooms.findById({ _id: req.params.id }, (err, room) => {

        var T_Price;
        if (req.session) {
            console.log(req.session.price);

            T_Price = req.session.price;
        }
        if (!req.session.price) {
            T_Price = room.price;
        }


        res.render('room_checkout', { room: room, T_Price });
    });

});

//room stripe payment
router.post('/stripe_checkout/:id', (req, res) => {
    rooms.findById({ _id: req.params.id }, (err, room) => {
        console.log(room)

        // stripe.charges.create({
        //     source: req.body.stripeToken,
        //     amount: room.price * 100,
        //     currency: 'usd',
        //     description: room.class + ' ' + 'booking'

        // }, (err, charge) => {
        //     console.log(charge);
        //     console.log(req.user);

        // activate pay status
        var payment = {};
        payment.paid = true;
        rooms.update({ _id: req.params.id }, { $set: payment }, (err, roomupdate) => {
            if (roomupdate) {


                //   save the room order to database

                const order = new roomsOrder({
                    user: req.user,
                    Paid_by: req.body.name,
                    contact_details: req.body.phone1 + "-" + req.body.phone2 + "-" + req.body.phone3,
                    address: req.body.address,
                    country: req.body.country,
                    contact: req.body.contact,
                    price: req.session.price,
                    // paymentid: charge.id,
                    // currency: charge.currency,
                    // paid: charge.outcome.paid,
                    // source: charge.source.object,
                    check_in: req.session.Check_in_Time,
                    check_out: req.session.Check_out_Time,
                    room: room
                });

                order.save((err, order) => {
                    if (err) {
                        console.log(err)
                    }
                    console.log(order);
                })
            }
        });




        //         // send mail after successfull charge ; nodemailer

        //         const MailTransporter = nodemailer.createTransport({
        //             service: 'Gmail',
        //             auth: {
        //                 user: 'hotelLuxuz@gmail.com',
        //                 pass: 'palace4x4'
        //             }
        //         });
        //         const bookedRoom = {
        //             room: room.class,
        //             Room_No: room.room_number,
        //             Room_Size: room.room_size,
        //             Book_Status: room.isActive,
        //             image: room.imageUrl

        //         }



        //         const mailContent = `
        //         <b>HOTEL LUXUZ</b>
        //         <p>Hi  ${  req.body.name } ,Thanks for booking using our services, we are happy to serve you </p>
        //            <h2> BOOKING DETAILS</h2>
        //            <ul>

        //            <li> 
        //            <h6> Name:   ${req.body.name} </h6>
        //            </li>

        //            <li> 
        //            <h6> Address:   ${req.body.address} </h6>
        //            </li>

        //            <li> 
        //            <h6> Country:   ${req.body.country} </h6>
        //            </li>

        //            <li> 
        //            <h6> Phone no_:   ${req.body.phone1}-${req.body.phone2}-${req.body.phone3} </h6>
        //            </li>


        //              <li> 
        //              <h6> Room Type:   ${room.class} </h6>
        //              </li>

        //              <li> 
        //              <h6> Amount: $   ${charge.amount/ 100} </h6>
        //              </li>

        //              <li> 
        //              <h6> Stay Days:   ${req.session.period} </h6>
        //              </li>


        //              <li> 
        //              <h6> Check in Date:   ${req.session.Check_in_Time} </h6>
        //              </li>


        //              <li> 
        //              <h6> Check out Date:   ${req.session.Check_out_Time} </h6>
        //              </li>




        //              <li> 
        //              <h6> paid: ${charge.paid}</h6>
        //              </li>

        //              <li> 
        //              <h6> Paid with:  ${charge.source.object }</h6>
        //              </li>

        //              <li> 
        //              <h6> Brand:  ${charge.source.brand }</h6>
        //              </li>

        //              <li> 
        //              <h6> Room:  ${bookedRoom.room }</h6>
        //              </li>

        //              <li> 
        //              <h6> Room_No:  ${bookedRoom.Room_No}</h6>
        //              </li>

        //              <li> 
        //              <h6> Room_Size:  ${bookedRoom.Room_Size}</h6>
        //              </li>

        //              <li> 
        //              <h6> Book_Status:  ${bookedRoom.Book_Status}</h6>
        //              </li>

        //              <li> 
        //              <h6> Refunded:  ${charge.refunded}</h6>
        //              </li>

        //              <li> 
        //              <h6> Visit us again at: <a href=' https:luxuzhotels/hotel/rooms'> https:luxuzhotels.hotel/rooms</a> </h6>
        //              </li>



        //            </ul>
        //         `;

        //         console.log(room);

        //         const Mailoptions = {
        //             to: req.user ? req.user.email : charge.source.name,
        //             from: 'hotelLuxuz@gmail.com',
        //             subject: 'room booking for' + ' ' + room.class,
        //             text: 'Hi' + ' ' + req.user ? req.user.username : ' ',
        //             html: mailContent
        //         }

        //         MailTransporter.sendMail(Mailoptions, (err, sent) => {
        //             if (err) {
        //                 console.log(err);
        //             } else {
        //                 console.log(charge);
        //                 console.log(room.price);
        //                 req.flash('success', 'successfully paid please check your mail for more details ');
        //                 res.redirect('/hotelluxuz/hotel/rooms')
        //             }
        //         });



        //         req.flash('success', 'successfully paid please check your mail for more details ');
        //         res.redirect('/hotelluxuz/hotel/rooms');

        // });



    });

});







//activate payment status

router.post('/paid:id', (req, res) => {
    var paid = room.paid = true;
    rooms.findByIdAndUpdate({ _id: req.params.id }, { $set: paid }, (err, room) => {
        if (room) {
            res.redirect('/hotelluxuz/hotel/rooms');
        }
    });
});

// room by type
router.get('/:room_type', (req, res, next) => {
    var type = req.params.room_type;


    rooms.find({ class: type }, (err, room) => {
        //room stats
        var rm = ' ';
        var bookedrooms = 0;
        var freerooms = 0;
        var roomclass = ' ';

        for (let i = 0; i < room.length; i++) {
            rm += room[i].isActive;
            bookedrooms += room[i].isActive;
            freerooms += room[i].isActive === false;
            roomclass += room[i].class;

        }
        res.render('rooms', { data: room, type, rm, freerooms, roomclass: roomclass, bookedrooms, booked: rm ? true : false })



    });
});


//get single room

router.get('/room/:id', (req, res, next) => {
    rooms.findById({ _id: req.params.id }, (err, room) => {
        if (err) {
            res.json('internal error')
        }

        // get admin rights
        const user = req.user;
        if (user) {
            if (req.user.email === 'kingdomfilmz4x4@gmail.com') {
                req.user.isAdmin = true;


            } else {
                req.user.isAdmin = false;
            }
        }

        room.Total_Price = room.price;

        const checkin = moment().format().slice(0, -15);
        const checkout = moment().add(1, 'day').calendar()

        room.Check_in_Time = checkin;
        room.Check_out_Time = checkout;


        //time
        const booked = '1 day';

        res.render('rooms_single', { room: room, booked, user });
    });
});

//update room price by calender

router.post('/room/:id', (req, res) => {
    rooms.findById({ _id: req.params.id }, (eer, room) => {
        let {
            check_in,
            check_out
        } = req.body

        var checkin = check_in;
        var checkout = check_out;

        room.Check_in_Time = check_in;
        room.Check_out_Time = check_out;

        // time sessions
        req.session.Check_in_Time = room.Check_in_Time;
        req.session.Check_out_Time = room.Check_out_Time;

        //time difference

        var diff = moment(check_out).from(check_in);

        //timetime remaining

        var booked = diff.slice(2);


        var numbersplit = diff.split(' ');

        var number = numbersplit[1];
        if (number === 'a') {

            number = 1;
        }
        if (number <= 1) {

            number = 1;
        }

        // stayperiod session
        req.session.period = number;




        // calc  final_price
        const final = (number * room.price);
        room.Total_Price = final;
        req.session.price = final;
        console.log(req.session.price);




        // room free
        const freetime = moment(check_out).fromNow();

        res.render('rooms_single', { room: room, booked, checkout, checkin, freetime });
    })
})

//update rooms

router.post('/update/:id', (req, res) => {
    const roomz = {};
    roomz.class = req.body.class;
    roomz.room_number = req.body.room;

    roomz.isActive = req.body.active;
    roomz.room_size = req.body.size;
    roomz.meals = req.body.meals;
    roomz.price = req.body.price;

    roomz.wifi = req.body.wifi;
    roomz.swimmingpool = req.body.pool;

    roomz.medical_service = req.body.medical;
    roomz.balcony = req.body.balcony;

    var id = req.params.id;
    rooms.update({ _id: id }, { $set: roomz }, (err, room) => {
        if (err) {
            console.log(err)
        }

        console.log(room);
        res.redirect('/hotelluxuz/hotel/rooms/room/' + id);

    });
});


// advanced search

//  comfirm search selection
router.post('/search', (req, res) => {
    const {
        guests,
        rooms
    } = req.body;

    req.session.guests = guests;
    req.session.rooms = rooms;
    //console.log(req.session.guests);

    res.redirect('/hotelluxuz/hotel/rooms');
});



//room by type and isActive

router.get('/room/:room_type/:status', (req, res) => {
    var type = req.params.room_type;
    var status = req.params.status;

    rooms.find({ class: type, isActive: status }, (err, room) => {
        if (err) {
            res.json({
                'opps': 'something wrong happened'
            });
        }


        res.json(room);

    });
});




//by not active by type by max guests
router.get('/room/:type/:status/:max_guest', (req, res) => {
    var type = req.params.type;
    var status = req.params.status;
    var max = req.params.max_guest;
    rooms.find({ class: type, isActive: status, max_guests: max }, (err, room) => {
        // if (err) {
        //     res.json(err)
        // }
        // if (!room) {
        //     res.json({
        //         'msg': 'no rooms found'
        //     });
        // }

        req.session.rooms = null;
        req.session.guests = null;

        res.render('rooms', { type, max, data: room });

    });
});






//edit rooms
router.get('/edit/:id', (req, res) => {
    rooms.findById({ _id: req.params.id }, (err, room) => {
        if (room) {


            res.render('room_edit', { room: room });
        }
    })
});










//activate room
router.post('/activate/:id', (req, res) => {

    const id = req.params.id;
    var btn = {}

    btn.isActive = true;


    rooms.update({ _id: id }, { $set: btn }, (err, room) => {
        if (err) {
            console.log(err);
        }

        req.flash('success', 'you have booked this room please')
        res.redirect('/hotelluxuz/hotel/rooms/room/' + id);


    });

    //
});





//deactivate room
router.post('/deactivate/:id', (req, res) => {
    const id = req.params.id;
    const deac = {};
    deac.isActive = false;
    let Active = false;
    rooms.update({ _id: id }, { $set: deac }, (err, status) => {
        if (req.session) {
            req.session.price = null;
            req.session.Check_in_Time = null;
            req.session.Check_out_Time = null;
            req.session.period = null;




        }
        if (err) {
            console.log(err)
        }
        req.flash('danger', 'oops ..you have cancled your book..!!!')
        res.redirect('/hotelluxuz/hotel/rooms/room/' + id);
    })
})
module.exports = router;