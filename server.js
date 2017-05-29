require('dotenv').config();
var express = require('express');
var app = express();
var path = require('path');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var User = require('./models/user').User;
var user = require('./routehandlers/user').user;
var stock = require('./routehandlers/stock').stock;
var utils = require('./utils/utils').utils;

/**
 * App Uses
 */
app.listen(4000, function () {console.log(4000);});
app.use(express.static(__dirname + '/'));
app.use(require('cookie-parser')());
app.use(require('body-parser').json({extended: true}));
app.use(require('express-session')({secret: 'keyboard cat', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

/**
 * Database
 */
var db = mongoose.connection;
var connect = mongoose.connect(process.env.DB_ADDRESS, function (err) {});
db.once('open', function () {});

/**
 * Routes
 */
app.get('/', function (req, res){res.sendFile(path.resolve('./app/html/index.html'));});

app.get('/stocks', user.isAuthenticated, stock.getUserStocks);

app.get('/stockCharts', user.isAuthenticated, stock.getUserStockCharts);

app.post('/stocks', user.isAuthenticated, stock.stockLookUp);

app.post('/removeStock', user.isAuthenticated, stock.removeStock);

app.get('/userInfo', user.isAuthenticated, user.getSession);


/**
 * Facebook/Passport Authentication and Login
 */

app.get('/facebook',
    passport.authenticate('facebook'));

app.get('/facebook/return',
    passport.authenticate('facebook', {failureRedirect: '/#!/register'}),
    function (req, res) {
        res.redirect('/#!/redirect');
    });

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/#!/register');
});


passport.use(new Strategy({
        clientID: process.env.FB_CLIENT_ID,
        clientSecret: process.env.FB_CLIENTSECRET,
        callbackURL: 'http://localhost:4000/facebook/return'
    },
    function (accessToken, refreshToken, profile, cb) {
        utils.findDupe(User, 'userID', profile.id).then(function (data) {
            if (data == null) {
                utils.createRecord('User', profile).then(
                    function (data) {
                        console.log('here')
                        return cb(null, data)
                    },
                    function (err) {

                    });
            } else {
                return cb(null, data)

            }
        }, function (err) {
            console.log(err)
        });

    }));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});