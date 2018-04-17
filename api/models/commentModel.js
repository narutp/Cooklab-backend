'use strict';
var mongoose = require('mongoose');
var Moment = require('moment')
var Schema = mongoose.Schema;


var CommentSchema = new Schema({
  id_user: {
    type: String,
    ref: 'Users'
  },
  id_post: {
    type: String,
    ref: 'Posts'
  },
  text: {
    type: String,
  },
  timestamp: {
    type: Date
  }
  
});

module.exports = mongoose.model('Comments', CommentSchema);