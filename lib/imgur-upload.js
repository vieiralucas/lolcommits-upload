'use strict'


exports.upload = function(repo, file, callback) {
    var imgur  = require('imgur');

    // The following client ID is tied to the
    // registered 'lolcommit-imgur' app and is available
    // here for public, anonymous usage via this node
    // module only.
    imgur.setClientId('670f712ae4a352e');

    imgur.uploadFile(file)
        .then(function (res) {
            callback(null, res, repo, file);
        })
        .catch(function (err) {
            callback(err);
        });
}
