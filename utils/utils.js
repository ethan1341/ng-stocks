var User = require('../models/user').User;
var request = require('request');
var async = require('async');

/**
 *
 * General Utility Functions to be used in routehandlers
 */

var utils = {
    /**
     *
     * @param collection: The mongoose collection you would like to search : Object
     * @param key : The key of the collection your search will be based on : String
     * @param value : The value of the key the record model should match : String
     * @returns {Promise}
     */
    findDupe: function (collection, key, value) {
        var query = collection.where({[key]: value})
        return new Promise(function (resolve, reject) {
            query.findOne(function (error, record) {
                console.log('this is record', record)
                if (record == null || record !== undefined) {
                    resolve(record)
                }
                if (error) {
                    reject(error)
                }
            })
        });
    },

    /**
     *
     * @param model: The type of model you would like to create goes to switch statement : String
     * @param info: The info you are basing the model off of : Object
     * @returns {Promise}
     */
    createRecord: function (model, info) {
        switch (model) {
            case 'User':
                var newUser = new User({
                    name: info.displayName,
                    userID: info.id,
                    media: {
                        type: 'facebook'
                    }
                });
                new Promise(function (resolve, reject) {

                    newUser.save(function (err, record) {
                        if (err == null) {
                            resolve(record);
                        } else {
                            reject(err);
                        }
                    })
                });
        }
    },

    /**
     *
     * @param method: The type of request you would like to make : String
     * @param url: THe URL the user is making the request too : String
     * @param key : Additional custom queries to be made in the URL : Object
     * @param title : Title of the request(header) : String
     * @returns {Promise}
     */
    requestWrapper: function (method, url, key, title) {
        var options = {
            method: method,
            url: url,
            qs: key,
            headers: {
                "User-Agent": title
            }
        };
        return new Promise(function (resolve, reject) {
            request(options, function (error, response, body) {

                if (error) {
                    reject(error);
                } else {
                    return resolve(response);
                }
            })
        })
    },

    /**
     *
     * @param collection : Collection the user would like to query : Object
     * @param key : The key of the collection your search will be based on : String
     * @param value : value : The value of the key the record model should match : String
     * @param field : The field of the model where the Array is : String
     * @param indexValue :  The param which will be added to the array : Any
     * @returns {Promise}
     */

    /*TODO: This may be to interchangable*/
    updateCollectionArray: function (collection, key, value, field, indexValue) {
        var query = collection.where({[key]: value});
        return new Promise(function (resolve, reject) {
            query.findOneAndUpdate(function (err, data) {
                var existed = false;
                for (var i = 0; i < data[field].length; i++) {
                    if (data[field][i] == indexValue) {
                        existed = true;
                    }
                }
                if (existed == false) {
                    data[field].push(indexValue)
                }
                data.save();
            });
            resolve({success: 'true'})
        });
    },

    /**
     *
     * @param userID : The userID that the user wants to receive additional information for :  Integer
     * @returns {Promise}
     */
    getUserInfo: function (userID) {
        var query = User.where({'userID': userID});
        return new Promise(function (resolve, reject) {
            query.findOne(function (err, data) {
                if (data) {
                    resolve(data)
                } else {
                    reject(err);
                }
            });
        });
    }
};


module.exports.utils = utils;