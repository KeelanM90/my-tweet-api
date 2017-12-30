'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const utils = require('../app/api/utils.js');

suite('Auth API tests', function () {

  let users = fixtures.users;

  const tweetService = new TweetService(fixtures.tweetService);

  test('login-logout', function () {
    var returnedTweets = tweetService.getAllTweets();
    assert.isNull(returnedTweets);

    const response = tweetService.login(users[0]);
    returnedTweets = tweetService.getAllTweets();
    assert.isNotNull(returnedTweets);

    tweetService.logout();
    returnedTweets = tweetService.getAllTweets();
    assert.isNull(returnedTweets);
  });
});
