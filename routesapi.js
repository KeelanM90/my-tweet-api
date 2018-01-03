const UsersApi = require('./app/api/usersapi');
const TweetsApi = require('./app/api/tweetsapi');

module.exports = [

  { method: 'GET', path: '/api/users', config: UsersApi.find },
  { method: 'GET', path: '/api/users/{id}', config: UsersApi.findOne },
  { method: 'POST', path: '/api/users', config: UsersApi.create },
  { method: 'DELETE', path: '/api/users/{id}', config: UsersApi.deleteOne },
  { method: 'DELETE', path: '/api/users', config: UsersApi.deleteAll },
  { method: 'GET', path: '/api/users/current', config: UsersApi.findCurrent },

  { method: 'POST', path: '/api/follow', config: UsersApi.follow },
  { method: 'DELETE', path: '/api/follow/{id}', config: UsersApi.unfollow },
  { method: 'GET', path: '/api/followers/{id}', config: UsersApi.findFollowers },
  { method: 'GET', path: '/api/following/{id}', config: UsersApi.findFollowing },

  { method: 'GET', path: '/api/tweets', config: TweetsApi.find },
  { method: 'GET', path: '/api/users/{id}/tweets', config: TweetsApi.findUsersTweets },
  { method: 'GET', path: '/api/tweets/{id}', config: TweetsApi.findOne },
  { method: 'POST', path: '/api/tweets', config: TweetsApi.create },
  { method: 'DELETE', path: '/api/tweets/{id}', config: TweetsApi.deleteOne },
  { method: 'DELETE', path: '/api/tweets', config: TweetsApi.deleteAll },

  { method: 'POST', path: '/api/users/authenticate', config: UsersApi.authenticate },
];
