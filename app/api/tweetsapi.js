'use strict';

const Tweet = require('../models/tweet');
const Boom = require('boom');
const Utils = require('./utils');

exports.find = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.find({}).populate('tweeter')
        .exec()
        .then(tweets => {
          reply(tweets);
        })
        .catch(err => {
          reply(Boom.badImplementation('error accessing db'));
        });
  },
};

exports.findOne = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.findOne({ _id: request.params.id })
        .then(tweet => {
          if (tweet != null) {
            reply(tweet);
          }

          reply(Boom.notFound('id not found'));
        })
        .catch(err => {
          reply(Boom.notFound('id not found'));
        });
  },
};

exports.create = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    const tweet = new Tweet(request.payload);
    tweet.tweeter = Utils.getUserIdFromRequest(request);
    tweet
        .save()
        .then(newTweet => {
          Tweet.findOne(newTweet)
              .populate('tweeter')
              .then(tweet => {
                reply(tweet).code(201);
              });
        })
        .catch(err => {
          reply(Boom.badImplementation('error creating tweet'));
        });
  },
};

exports.deleteAll = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.remove({})
        .then(err => {
          reply().code(204);
        })
        .catch(err => {
          reply(Boom.badImplementation('error removing tweets'));
        });
  },
};

exports.deleteOne = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.remove({ _id: request.params.id })
        .then(tweet => {
          reply(tweet).code(204);
        })
        .catch(err => {
          reply(Boom.notFound('id not found'));
        });
  },
};
