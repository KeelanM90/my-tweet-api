'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

// For tests to pass, enable the mongoose seeder in models/db.js before running

suite('Tweet API tests', function () {

  let tweets = fixtures.tweets;
  let newTweet = fixtures.newTweet;
  let users = fixtures.users;
  this.timeout(15000);

  const tweetService = new TweetService(fixtures.tweetService);

  beforeEach(function () {
    tweetService.login(users[0]);
    tweetService.deleteAllTweets();
  });

  afterEach(function () {
    tweetService.deleteAllTweets();
    tweetService.logout();
  });

  test('Create a tweet', function () {
    const returnedTweet = tweetService.createTweet(newTweet);
    assert(_.some([returnedTweet], newTweet), 'returnedTweet must be a superset of newTweet');
    assert.isDefined(returnedTweet._id);
  });

  test('get tweet', function () {
    const t1 = tweetService.createTweet(newTweet);
    const t2 = tweetService.getTweet(t1._id);
    t2.tweeter = tweetService.getUser(t2.tweeter);
    assert.deepEqual(t1, t2);
  });

  test('get invalid tweet', function () {
    const t1 = tweetService.getTweet('1234');
    assert.isNull(t1);
  });

  test('delete a user', function () {
    const t = tweetService.createTweet(newTweet);
    assert(tweetService.getTweet(t._id) != null);
    tweetService.deleteTweet(t._id);
    assert(tweetService.getTweet(t._id) == null);
  });

  test('Get all tweets', function () {
    for (let t of tweets) {
      tweetService.createTweet(t);
    }

    const allTweets = tweetService.getAllTweets();
    assert.equal(allTweets.length, tweets.length);
  });

  test('Get all tweets empty', function () {
    const allTweets = tweetService.getAllTweets();
    assert.equal(allTweets.length, 0);
  });
});
