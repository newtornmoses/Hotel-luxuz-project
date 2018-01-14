const mongoose = require('mongoose');
const schema = mongoose.Schema;

const orderschema = new schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    userdetails: { type: Object },
    address: { type: String, required: true },
    contact: { type: String },
    name: { type: String, required: true },
    paymentid: { type: String },
    currency: { type: String },
    status: { type: String },
    paid: { type: Boolean },
    source: { type: String },
    brand: { type: String },
    date: { type: Date, required: true },
    items: { type: Array, required: true },
    totalqty: { type: Number },
    totalprice: { type: Number }






});


module.exports = mongoose.model('Order', orderschema);