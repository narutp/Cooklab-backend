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
    enum: ['1','2','3','4','5','6','7','8','9','10'],
    default: '1'
  },
  username: {
    type: String,
  },
  password: { 
    type: String,
  },
  achievements: [{
    type: String
  }],
  followings: [{
    type: String,
    ref: 'Users'
  }],
  fans: [{
    type: String,
    ref: 'Users'
  }],
  photo: {
    type: String,
    default: 'https://firebasestorage.googleapis.com/v0/b/cooklab-cb6c0.appspot.com/o/images%2F31131303_811219885735136_5945402947293675520_n.png?alt=media&token=9d743dd6-d6ab-490b-8816-ea55697d23e1'
  },
  cover: {
    type: String,
    default: 'https://firebasestorage.googleapis.com/v0/b/cooklab-cb6c0.appspot.com/o/images%2Fdefault_cover.jpg?alt=media&token=c56444f5-6850-400a-a752-5bb4450f17f3'
  },
  noti_status: {
    type: Boolean,
    default: true
  }

});

module.exports = mongoose.model('Users', UserSchema);