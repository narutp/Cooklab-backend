'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  bio: {
    type: String,
    default: ''
  },
  experience: {
    type: Number,
    default: 0
  },
  rank: {
    type: String,
    enum: ['beginner', 'intermediate', 'senior', 'expert'],
    default: 'beginner'
  },
  username: {
    type: String,
  },
  password: { 
    type: String,
  },
  achievements: {
    type: Array,
    default: []
  },
  followings: {
    type: Array,
    default: []
  },
  fans: {
    type: Array,
    default: []
  },
  photo: {
    type: String,
    default: ''
  }

});

module.exports = mongoose.model('Users', UserSchema);