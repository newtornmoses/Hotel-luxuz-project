const mongoose = require('mongoose');
const schema = mongoose.Schema;

const messsageSchema = new schema({
    name: String,
    email: String,
    message: String
});

module.exports = mongoose.model('Message', messsageSchema);