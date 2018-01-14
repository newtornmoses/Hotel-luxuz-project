const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const schema = mongoose.Schema;

const Userschema = schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: Boolean


});

Userschema.methods.encryptpassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

Userschema.methods.comparepassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('Users', Userschema);