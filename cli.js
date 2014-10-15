#!/usr/bin/env node

'use strict'

var path      = require('path'),
    commander = require('commander'),
    ftj       = require('./lib/filesToJson.js');
      
commander
    .version('0.1.0')
    .option('-i, --imgur', 'Upload lolcommits to imgur')
    .parse(process.argv)

if(commander.imgur) {
    var imgur = require('imgur');
    
    // The following client ID is tied to the
    // registered 'lolcommit-imgur' app and is available
    // here for public, anonymous usage via this node
    // module only.
    imgur.setClientId('670f712ae4a352e');  
    ftj.getJSON(function(err, json) {
        if(err) {
            return console.error(err);
        }
        var repo, output = {};
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
                    imgurUpload(repo, arr[i], function(err, res, rep, file) {
                        if(err) {
                            console.error(err);
                        }
                        output[rep][path.basename(file, '.jpg')] = res.data.link;
                        count++;
                        if(count === total) {
                            console.log(output);
                        }
                    })
                }
            }
        }
    });
}

function imgurUpload(repo, file, callback) {
    imgur.uploadFile(file)
        .then(function (res) {
            callback(null, res, repo, file);
        })
        .catch(function (err) {
            callback(err.message);
        });
}