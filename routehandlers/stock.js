var request = require('request');
var User = require('../models/user').User;
var utils = require('../utils/utils').utils;
var async = require('async');

/**
 *
 * Middleware functions that return/save stock information to be called in the routes
 */

var stock = {

    /**
     *
     * @param req
     * @param res
     * @param next
     * Looks up a symbol received from the client side. Adds to user array if the symbol is used in markit API
     */
    stockLookUp: function (req, res, next) {
        var userID = req.session.passport.user.userID;
        var params = {symbol: req.body.symbol};
        var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json';
        utils.requestWrapper('get', url, params, 'stocks').then(function (data) {
            var stockData = JSON.parse(data.body);
            var success = stockData.Status;
            if (success == undefined) {
                res.send('FAILED');
            } else {
                utils.updateCollectionArray(User, 'userID', userID, 'stocks', stockData.Symbol, stockData).then(function (data) {
                   utils.getChart(stockData.Symbol).then(function(data){
                       stockData.Graph = data;
                   })
                });
            }

        });
    },

    /**
     *
     * @param req
     * @param res
     * @param next
     * Returns current Users stock Array then retrieves information.
     * Uses async map
     */

    getUserStocks: function (req, res, next) {
        var userID = req.session.passport.user.userID;
        var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json';
        var asyncUrls = [];
        utils.getUserInfo(userID).then(function (data) {
            for (var i = 0; i < data.stocks.length; i++) {
                asyncUrls.push(data.stocks[i]);
            }
            async.map(asyncUrls, stock.getContent, function (err, result) {
                res.send(result);
            });
        })
    },

    /**
     * Tne iteratee of the async.map function for getUserStocks
     * @param symbol: The stock symbol that should be looked up : String
     * @param callback: Callback function : function
     */
    getContent: function (symbol, callback) {
        var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json';
        utils.requestWrapper('get', url, {symbol: symbol}, 'stocks').then(function (data) {
            var jsonData = JSON.parse(data.body);
            callback(null, jsonData);
        })
    },

    /**
     * Tne iteratee of the async.map function for getUserStockCharts
     * @param symbol: The stock symbol that should be looked up : String
     * @param callback: Callback function : function
     */
    getCharts: function (symbol, callback) {
        var url = 'http://dev.markitondemand.com/Api/v2/InteractiveChart/json?&parameters={"Normalized":false,"NumberOfDays":15,"DataPeriod":"Day","Elements":[{"Symbol":"' + symbol + '",' + '"Type":"price","Params":["ohlc"]},{"Symbol":"' + symbol + '",' + '"Type":"volume"}]}&_=1432147464500'
        utils.requestWrapper('get', url, {}, 'charts').then(function (data) {
            var jsonData = JSON.parse(data.body);
            callback(null, jsonData);
        }, function (err) {

        });
    },



    /**
     *
     * @param req
     * @param res
     * @param next
     * Returns the chart data for all stock symbols
     * Uses async map
     */

    getUserStockCharts: function (req, res, next) {
        var userID = req.session.passport.user.userID;
        var asyncSymbols = [];
        utils.getUserInfo(userID).then(function (data) {
            for (var i = 0; i < data.stocks.length; i++) {
                asyncSymbols.push(data.stocks[i]);
            }

            async.map(asyncSymbols, stock.getCharts, function (err, result) {
                res.send(result);
            });
        })
    },

    /**
     *
     * @param req
     * @param res
     * @param next
     * Receives symbol from client side to remove from user database
     */
    removeStock: function (req, res, next) {
        var userID = req.session.passport.user.userID;
        var symbol = req.body.symbol;
        utils.getUserInfo(userID).then(function (data) {
            for (var i = 0; i < data.stocks.length; i++) {
                console.log(symbol, data.stocks[i])
                if (symbol == data.stocks[i]) {
                    data.stocks.splice(i, 1);
                    console.log(data.stocks, 'datastocks')

                }
            }
            data.save(function (err, data) {
                console.log(data, 'd', err);
                res.send({complete: 'saved'});
            });
        });

    }

};


module.exports.stock = stock;