/**
 * Copyright 2014 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    bluemix = require('./config/bluemix'),
    SpeechToText = require('./speech-to-text'),
    request = require('request'),
    path = require('path'),
    validator = require('validator'),
    watson = require('watson-developer-cloud'),
    fs = require('fs'),
    extend = require('util')._extend;

// if bluemix credentials exists, then override local
var credentials = extend({
    url: "https://stream.watsonplatform.net/speech-to-text-beta/api",
    username: "c4c9f894-5701-44dd-a745-0125a146275c",
    password: "pk9A6uINLk1Q"
}, bluemix.getServiceCreds('speech_to_text')); // VCAP_SERVICES

// Save bluemix credentials
app.set('service', credentials);

// Create the service wrapper
var speechToText = new SpeechToText(credentials);

// Configure express
require('./config/express')(app, speechToText);

// Configure sockets
require('./config/socket')(io, speechToText);

// Bootstrap application settings
require('./config/express')(app);

// if bluemix credentials exists, then override local
var credentials1 = extend({
   version: 'v1',
   url: "https://gateway.watsonplatform.net/visual-recognition-beta/api",
   username: "d8f479f9-4fd7-4684-a19b-e92080d38e56",
   password: "7O0XDxb2SSzm"
}, bluemix.getServiceCreds('visual_recognition')); // VCAP_SERVICES

// Create the service wrapper
var visualRecognition = watson.visual_recognition(credentials1);

// render index page
app.get('/', function(req, res) {
  res.render('index');
});

app.post('/', function (req, res) {
    // Classifiers are 0 = all or a json = {label_groups:['<classifier-name>']}
    var classifier = req.body.classifier || '0';  // All
    if (classifier !== '0') {
        classifier = JSON.stringify({ label_groups: [classifier] });
    }

    var imgFile;

    if (req.files.image) {
        // file image
        imgFile = fs.createReadStream(req.files.image.path);
    } else if (req.body.url && validator.isURL(req.body.url)) {
        // web image
        imgFile = request(req.body.url.split('?')[0]);
    } else if (req.body.url && req.body.url.indexOf('images') === 0) {
        // local image
        imgFile = fs.createReadStream(path.join('public', req.body.url));
    } else {
        // malformed url
        return res.status(500).json({ error: 'Malformed URL' });
    }

    var formData = {
        labels_to_check: classifier,
        image_file: imgFile
    };

    visualRecognition.recognize(formData, function(error, result) {
        if (error)
            return res.status(error.error ? error.error.code || 500 : 500).json({ error: error });
        else
            return res.json(result);
    });
});
//*/
/*Ended visual recognization */

var port = process.env.VCAP_APP_PORT || 3000;
server.listen(port);
console.log('listening at:', port);
