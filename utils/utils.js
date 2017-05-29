var User = require('../models/user').User;
var request = require('request');
var async = require('async')
var utils = {

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
        ;
    },


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
    updateCollectionArray: function (collection, key, value, field, indexValue) {
        var query = collection.where({[key]: value})
        query.findOneAndUpdate(function (err, data) {
            var existed = false;
            for (var i = 0; i < data[field].length; i++) {
                console.log(i);
                if (data[field][i] == indexValue) {
                    existed = true;
                    console.log('existed')
                }
            }
            if (existed == false) {
                console.log(data[field], indexValue)
                data[field].push(indexValue)
            }
            data.save();
        });
    },
    getUserStocks: function (collection, key, value) {
        var query = collection.where({[key]: value});
        query.findOne(function (err, data) {
            console.log(data);
        });
    },

    getUserInfo: function (userID) {
        var query = User.where({'userID': userID});
        return new Promise(function (resolve,reject) {
            query.findOne(function (err, data) {
                console.log('woor')
                if (data) {
                    console.log(data,'data')
                    resolve(data)
                } else {
                    console.log(err,'err')
                    reject(err);
                }
            });
        });
    }
};


module.exports.utils = utils;