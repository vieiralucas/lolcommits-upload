'use strict'

var imgurUp = require('./imgur-upload.js'),
    path    = require('path'),
    ftj     = require('./filesToJson.js'),
    output  = {};


exports.upload = function(host, callback) {
    ftj.getJSON(function(err, json) {
        if(err) {
            return callback(err);
        }
        var repo;
        var total = 0;
        for (repo in json) {
            if(json.hasOwnProperty(repo)) {
                total += json[repo].length;
            }
        }
        for (repo in json) {
            if (json.hasOwnProperty(repo)) {
                var arr = json[repo];
                output[repo] = {};
                var count = 0;
                for (var i = 0; i < arr.length; i++) {
                    if(host === 'imgur') {
                        imgurUp.upload(repo, arr[i], function(err, res, rep, file) {
                            if(err) {
                                return callback(err);
                            }
                            output[rep][path.basename(file, '.jpg')] = res.data.link;
                            count++;
                            if(count === total) {
                                return callback(null, output);
                            }
                        });
                    }
                }
            }
        }
    });
}