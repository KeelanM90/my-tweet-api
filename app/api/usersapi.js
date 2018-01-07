'use strict';

const User = require('../models/user');
const Relationship = require('../models/relationship');
const Boom = require('boom');
const Utils = require('./utils.js');
const Bcrypt = require('bcrypt');

const saltRounds = 10;

exports.getAvailability = {

  auth: false,

  handler: function (request, reply) {
    reply(true);
  },

};

exports.find = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.find({}).exec().then(users => {
      reply(users);
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
    User.findOne({ _id: request.params.id }).then(user => {
      if (user != null) {
        reply(user);
      }
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

exports.findCurrent = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    let currentUser = Utils.getUserIdFromRequest(request);
    User.findOne({ _id: currentUser }).then(user => {
      if (user != null) {
        reply(user);
      }
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};

exports.create = {

  auth: false,

  handler: function (request, reply) {
    const user = new User(request.payload);
    Bcrypt.hash(user.password, saltRounds, function (err, hash) {
      user.password = hash;
      user.save().then(newUser => {
        reply(newUser).code(201);
      }).catch(err => {
        reply(Boom.badImplementation('error creating User'));
      });
    });
  },

};

exports.update = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    const user = User(request.payload);
    User.findOne({ email: user.email }).then(oldUser => {
      Bcrypt.hash(user.password, saltRounds, function (err, hash) {
        if (user.password != '') {
          user.password = hash;
        } else {
          user.password = oldUser.password;
        }

        console.log(user);
        user.update(user).then(updatedUser => {
          reply(updatedUser).code(201);
        }).catch(err => {
          reply(Boom.badImplementation('error updating User'));
        });
      });
    });
  },
};

exports.deleteAll = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Users'));
    });
  },

};

exports.deleteOne = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.remove({ _id: request.params.id }).then(user => {
      reply(User).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};

exports.authenticate = {

  auth: false,

  handler: function (request, reply) {
    const user = request.payload;
    console.log('Authenticating...');
    User.findOne({ email: user.email }).then(foundUser => {
      Bcrypt.compare(user.password, foundUser.password, function (err, isUser) {
        if (isUser) {
          const token = Utils.createToken(user);
          reply({ success: true, token: token, user: user }).code(201);
        } else {
          reply({ success: false, message: 'Authentication failed. User not found.' }).code(201);
        }
      }).catch(err => {
        reply(Boom.notFound('internal db failure'));
      });
    });
  },

};

exports.follow = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    const relationship = new Relationship(request.payload);
    console.log(request.params);
    relationship.follower = Utils.getUserIdFromRequest(request);
    console.log(relationship);
    relationship.save().then(newRelationship => {
      reply(newRelationship).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating User'));
    });
  },
};

exports.unfollow = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    let follower = Utils.getUserIdFromRequest(request);
    let followee = request.params.id;

    Relationship.remove({ follower: follower, followee: followee }).then(relationship => {
      reply(Relationship).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

exports.findFollowers = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Relationship.find({ followee: request.params.id }).populate('follower').exec().then(relationships => {
      let followers = relationships.map(relationship => {
        return relationship.follower;
      });
      reply(followers);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },
};

exports.findFollowing = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    Relationship.find({ follower: request.params.id }).populate('followee').exec().then(relationships => {
      let followees = relationships.map(relationship => {
        return relationship.followee;
      });
      reply(followees);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },
};
