require('dotenv').config()
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


app.listen(4000,function(){
    console.log(4000);
});

app.use(express.static(__dirname + '/'));
app.use(require('cookie-parser')());
app.use(require('body-parser').json({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

var db = mongoose.connection;

var connect = mongoose.connect(process.env.DB_ADDRESS, function(err) {
});
db.once('open', function() {});


//If I put this in a function outside server.js and run the function here does it work because of closures?
passport.use(new Strategy({
        clientID: process.env.FB_CLIENT_ID,
        clientSecret: process.env.FB_CLIENTSECRET,
        callbackURL: 'http://localhost:4000/facebook/return'
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile.display)
        utils.findDupe(User,'userID',profile.id).then(function(data){
            if(data == null){
                utils.createRecord('User',profile).then(
                    function(data){
                        console.log('here')
                        return cb(null,data)
                    },
                    function(err){

                    });
            }else{
                return cb(null,data)

            }
        },function(err){console.log(err)});

    }));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

app.get('/',function(req,res){
    res.sendFile(path.resolve('./app/html/index.html'));
});


app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/#!/register');
});

app.get('/stocks',stock.getUserStocks);

app.get('/stockCharts',stock.getUserStockCharts);

app.post('/stocks',stock.stockLookUp);

app.post('/register',function(req,res){

});

app.get('/userInfo',user.checkSession);

app.get('/facebook',
    passport.authenticate('facebook'));

app.get('/facebook/return',
    passport.authenticate('facebook', { failureRedirect: '/#!/register' }),
    function(req, res) {
        res.redirect('/#!/redirect');
    });


function isAuthenticated(req, res, next){
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
};


