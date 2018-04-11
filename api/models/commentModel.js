'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CommentSchema = new Schema({
  id_user: {
    type: String,
  },
  id_post: {
    type: String,
  },
  text: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
  
});

module.exports = mongoose.model('Comments', CommentSchema);