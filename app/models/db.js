'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var dbURI = 'mongodb://tweetuser:tweetuser@ds249025.mlab.com:49025/mytweetapp';

if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGODB_URI;
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
  if (process.env.NODE_ENV != 'production') {
    var seeder = require('mongoose-seeder');
    const data = require('./initdata.json');
    seeder.seed(data, { dropDatabase: false, dropCollections: true }).then(dbData => {
      console.log('Preloading test data');
      console.log(dbData);
    }).catch(err => {
      console.log(error);
    });
  }
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});
