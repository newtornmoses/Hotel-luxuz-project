const mongoose = require('mongoose');
const schema = mongoose.Schema;
const userSchema = new schema({
    title: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Shop', userSchema);