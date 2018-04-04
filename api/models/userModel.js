'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  name: {
    type: String,
    // required: 'Kindly enter the name of the user'
  },
  email: {
    type: String,
    // required: 'Enter the email of the user'
  },
  bio: {
    type: String,
    default: 0
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
    // required: 'Enter the username of the user'
  },
  password: { 
    type: String,
    // required: 'Enter the password of the user'
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