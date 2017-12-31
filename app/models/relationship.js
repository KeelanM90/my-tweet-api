'use strict';

const mongoose = require('mongoose');

const relationshipSchema = mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  followee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Relationship = mongoose.model('Relationship', relationshipSchema);
module.exports = Relationship;
