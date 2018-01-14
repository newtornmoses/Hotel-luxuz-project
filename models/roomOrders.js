const mongoose = require('mongoose');

const schema = mongoose.Schema;

const room_orderSchema = new schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    rooms: { type: mongoose.Schema.Types.ObjectId, ref: 'Rooms' },

    Room: { type: Object },
    Paid_by: { type: String, Required: true },
    contact_details: { type: String, Required: true },
    address: { type: String, Required: true },
    country: { type: String, Required: true },
    contact: { type: String, Required: true },
    check_in: { type: String },
    check_out: { type: String },
    paymentid: { type: String },
    price: { type: Number },
    paid: { type: String },
    source: { type: String }







});


module.exports = mongoose.model('Roomsorder', room_orderSchema);