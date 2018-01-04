'use strict';

const User = require('../models/user');
const Relationship = require('../models/relationship');
const Boom = require('boom');
const Utils = require('./utils.js');

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
    user.save().then(newUser => {
      reply(newUser).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating User'));
    });
  },

};

exports.update = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    const user = User(request.payload);
    console.log(user);
    user.update(user).then(updatedUser => {
      reply(updatedUser).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error updating User'));
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

      console.log(foundUser.email);
      if (foundUser && foundUser.password === user.password) {
        const token = Utils.createToken(foundUser);
        reply({ success: true, token: token, user: foundUser }).code(201);
      } else {
        reply({ success: false, message: 'Authentication failed. User not found.' }).code(201);
      }
    }).catch(err => {
      reply(Boom.notFound('internal db failure'));
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
