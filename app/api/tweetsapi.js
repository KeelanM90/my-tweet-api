'use strict';

const Tweet = require('../models/tweet');
const Boom = require('boom');
const Utils = require('./utils');
const Relationship = require('../models/relationship');
const cloudinary = require('cloudinary');
const env = require('../../.data/.env.json');
cloudinary.config(env.cloudinary);

exports.find = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.find({}).populate('tweeter')
        .exec()
        .then(tweets => {
          tweets.sort(function (a, b) {
            a = new Date(a.date);
            b = new Date(b.date);
            return a > b ? -1 : a < b ? 1 : 0;
          });

          reply(tweets);
        })
        .catch(err => {
          reply(Boom.badImplementation('error accessing db'));
        });
  },
};

exports.findUsersTweets = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Tweet.find({ tweeter: request.params.id }).populate('tweeter')
        .exec()
        .then(tweets => {
          tweets.sort(function (a, b) {
            a = new Date(a.date);
            b = new Date(b.date);
            return a > b ? -1 : a < b ? 1 : 0;
          });

          reply(tweets);
        })
        .catch(err => {
          reply(Boom.badImplementation('error accessing db'));
        });
  },
};

exports.findFollowedTweets = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    const follower = Utils.getUserIdFromRequest(request);

    Relationship.find({ follower: follower }).then(relationships => {
      let followees = relationships.map(relationship => {
        return relationship.followee;
      });
      return Tweet.find({
        tweeter: { $in: followees, },
      }).populate('tweeter');
    }).then(tweets => {
      tweets.sort(function (a, b) {
        a = new Date(a.date);
        b = new Date(b.date);
        return a > b ? -1 : a < b ? 1 : 0;
      });

      reply(tweets);
    }).catch(err => {
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
    const data = request.payload.image;
    tweet.tweeter = Utils.getUserIdFromRequest(request);
    tweet.date = new Date();
    if (data != '') {
      cloudinary.uploader.upload(data).then(result => {
        tweet.img = result.url;
        saveTweet(tweet, reply);
      }).catch(err => {
        console.log(err);
      });
    } else {
      saveTweet(tweet, reply);
    }
  },
};

function saveTweet(tweet, reply) {
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
}

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
