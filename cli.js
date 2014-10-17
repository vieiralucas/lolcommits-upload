#!/usr/bin/env node

'use strict'

var path      = require('path'),
    fs        = require('fs'),
    commander = require('commander'),
    prompt    = require('prompt'),
    colors    = require('colors'),
    uploader  = require('./lib/uploader.js');
      
commander
    .version('1.0.1')
    .usage('[options] <outputfile>')
    .option('-i, --imgur', 'upload lolcommits to imgur')
    .option('-a, --all', 'upload lolcommits to every supported host');

commander.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    $ lolcommits-upload --imgur output.json');
  console.log('    $ lolcommits-upload -a output.json');
  console.log('');
});

commander.parse(process.argv)

if(!commander.imgur && ! commander.all) {
    commander.help();
}

var outputFilePath = commander.args[0];
if(typeof(outputFilePath) == 'undefined') {
    prompt.message = '';
    prompt.delimiter = '';
    var schema = {
        properties: {
            output: {
                description: "Path to the output file: ",
                default: "lolcommits-upload.json",
            }
        }
    }
    prompt.start();
    prompt.get(schema, function (err, result) {
        outputFilePath = result.output;
        upload();
    });
} else {
    upload();
}

function upload() {
    var all = commander.all;
    if(commander.imgur || all) {
        console.log('Uploading to imgur...'.yellow);
        uploader.upload('imgur', function(err, json) {
            if(err) {
                return console.error(err);
            }
            fs.writeFile(outputFilePath, JSON.stringify(json, null, 4), function(err) {
                console.log('The lolcommits were successfully uploaded to imgur, check the links at '.green + outputFilePath.green + '.'.green);
            });

        });
    } else {
        console.log('Please specify a host using one of the following options: '.red);
        commander.help();
    }
}