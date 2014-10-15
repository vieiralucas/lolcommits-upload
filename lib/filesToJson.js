'use strict'

var fs            = require('fs'),
    file          = require('file'),
    path          = require('path'),
    homedir       = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME,
    lolcommitsdir = homedir + '/.lolcommits';


exports.getJSON = function(callback) {
    var json = {};
    var files = fs.readdirSync(lolcommitsdir);
    var count = 0;
    for (var i = 0; i < files.length; i++) {
        if(fs.lstatSync(lolcommitsdir + '/' + files[i]).isDirectory()) {
            count++;
        }
    }
    var walked = 0;
    file.walk(lolcommitsdir, function(err, dirPath, dirs, files) {
        if(err) {
            return callback(err);
        }
        if(dirPath !== lolcommitsdir) {
            var splitPath = dirPath.split(path.sep)
            var jpgFiles = [];
            for (var i = 0; i < files.length; i++) {
                if(path.extname(files[i]) === '.jpg'){
                    jpgFiles.push(files[i])
                }
            }
            json[splitPath[splitPath.length - 1]] = jpgFiles;
            walked++;
        }
        if(walked === count) {
            return callback(null, json);
        }
        
    });
}