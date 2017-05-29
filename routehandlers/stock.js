var request = require('request');
var User = require('../models/user').User;
var utils = require('../utils/utils').utils;
var async = require('async');

var stock = {
    stockLookUp: function (req, res, next) {
        var userID = req.session.passport.user.userID;
        var params = {symbol: req.body.symbol}
        var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json';
        utils.requestWrapper('get', url, params, 'stocks').then(function (data) {
            console.log('here')
            utils.updateCollectionArray(User, 'userID', userID, 'stocks', params.symbol);
        });
    },

    getUserStocks: function (req, res, next) {
        var userID = req.session.passport.user.userID;
        var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json';
        var asyncUrls = [];
        utils.getUserInfo(userID).then(function (data) {
            for (var i = 0; i < data.stocks.length; i++) {
                asyncUrls.push(data.stocks[i]);
            }
            async.map(asyncUrls, stock.getContent,function(err,result){
                res.send(result);
            });
        })
    },

    getContent: function (symbol, callback) {
        var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json';
        utils.requestWrapper('get', url, {symbol:symbol}, 'stocks').then(function (data) {
            var jsonData = JSON.parse(data.body);
            callback(null,jsonData);
        })
    },

    getCharts: function(symbol,callback){
        var url = 'http://dev.markitondemand.com/Api/v2/InteractiveChart/json?&parameters={"Normalized":false,"NumberOfDays":15,"DataPeriod":"Day","Elements":[{"Symbol":"'+symbol + '",' + '"Type":"price","Params":["ohlc"]},{"Symbol":"'+symbol + '",' + '"Type":"volume"}]}&_=1432147464500'
        utils.requestWrapper('get',url,{},'charts').then(function(data){
            var jsonData= JSON.parse(data.body);
            console.log(jsonData);
            callback(null,jsonData);
        },function(err){console.log('this si the error',err,'rrr')});
    },

    getUserStockCharts:function(req,res,next){
        var userID = req.session.passport.user.userID;
        var asyncSymbols = [];
        utils.getUserInfo(userID).then(function (data) {
            for (var i = 0; i < data.stocks.length; i++) {
                asyncSymbols.push(data.stocks[i]);
            }

            async.map(asyncSymbols, stock.getCharts,function(err,result){
                res.send(result);
            });
        })
    }




};

module.exports.stock = stock;