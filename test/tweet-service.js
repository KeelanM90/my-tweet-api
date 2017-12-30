'use strict';

const SyncHttpService = require('./sync-http-client');
const baseUrl = 'http://localhost:4000';

class TweetService {

  constructor(baseUrl) {
    this.httpService = new SyncHttpService(baseUrl);
  }

  login(user) {
    return this.httpService.setAuth('/api/users/authenticate', user);
  }

  logout() {
    this.httpService.clearAuth();
  }

  getUsers() {
    return this.httpService.get('/api/users');
  }

  getUser(id) {
    return this.httpService.get('/api/users/' + id);
  }

  createUser(newUser) {
    return this.httpService.post('/api/users', newUser);
  }

  deleteOneUser(id) {
    return this.httpService.delete('/api/users/' + id);
  }

  deleteAllUsers() {
    return this.httpService.delete('/api/users');
  }

  createTweet(tweet) {
    return this.httpService.post('/api/tweets', tweet);
  }

  getTweet(id) {
    return this.httpService.get('/api/tweets/' + id);
  }

  getAllTweets() {
    return this.httpService.get('/api/tweets');
  }

  deleteAllTweets() {
    return this.httpService.delete('/api/tweets');
  }

  deleteTweet(id) {
    return this.httpService.delete('/api/tweets/' + id);
  }
}

module.exports = TweetService;
