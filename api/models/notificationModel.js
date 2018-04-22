'use strict';
var mongoose = require('mongoose');
var Moment = require('moment')
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
  id_target: {
    type: String,
    ref: 'Users'
  },
  id_user: {
    type: String,
    ref: 'Users'
  },
  type: {
    type: String,
    enum: ['comment','love']
  },
  id_post: {
    type: String,
    ref: 'Posts'
  },
  timestamp: {
    type: Date
  }
  
});

module.exports = mongoose.model('Notification', NotificationSchema);