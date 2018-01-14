const express = require('express');
const Path = require('path');
const app = express();
const bodyparser = require('body-parser');
const cookie = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const xvalidator = require('express-validator');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');
require('dotenv/config');

//connection
mongoose.connect(process.env.MONGODB_URL);


//listen to database connection

mongoose.connection.on('open', () => {
    console.log('server connected to mongodb database');
})

//include passport user config
require('./config/passport');

//port
const port = process.env.PORT || 3000;

//routes
const mainpage = require('./routes/main_page');
const shop = require('./routes/shop');
const users = require('./routes/users');
const addtocart = require('./routes/addto-cart');
const checkout = require('./routes/check_out');
const rooms = require('./routes/room_booking');


//static files
app.use(express.static(Path.join(`${__dirname}/public`)));
app.set('views', Path.join(__dirname, 'views'));

//engine
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));



//middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(xvalidator());
app.use(cookie());
app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 82 * 60 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.danger = req.flash('danger');

    next();
});

//connect routes
app.use('/hotelluxuz', mainpage);
app.use('/hotelluxuz/shop', shop);
app.use('/hotelluxuz/users', users);
app.use('/hotelluxuz/shop/cart', addtocart);
app.use('/hotelluxuz/shop/checkout', checkout);
app.use('/hotelluxuz/hotel/rooms', rooms);

//connect server
app.listen(port, () => {
    console.log(`server connected on port  ${port} `);
});