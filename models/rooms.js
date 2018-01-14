const mongoose = require('mongoose');

const schema = mongoose.Schema;

const roomSchema = schema({
    class: { type: String, required: true },
    room_number: { type: String, required: true },
    Check_in_Time: { type: String },
    booked_by: { type: schema.Types.ObjectId, ref: 'User' },
    Check_out_Time: { type: String },
    Time_Remaining: String,
    room_type: String,
    Total_Price: Number,
    beds: Number,
    paid: Boolean,
    max_guests: { type: Number, required: true },
    isActive: { type: Boolean, required: true },
    room_size: { type: String, required: true },
    meals: { type: Boolean, required: true },
    price: { type: Number, required: true },
    wifi: Boolean,
    swimmingpool: Boolean,
    imageUrl: String,
    medical_service: Boolean,
    balcony: Boolean

});

module.exports = mongoose.model('Rooms', roomSchema);