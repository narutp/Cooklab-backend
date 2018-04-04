'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CommentSchema = new Schema({
  id_user: {
    type: String,
    required: 'Id of user who own the comment'
  },
  id_post: {
    type: String,
    default: 'Id of post which have this comment'
  },
  text: {
    type: String,
    required: 'Text of the comment'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
  
});

module.exports = mongoose.model('Comments', CommentSchema);