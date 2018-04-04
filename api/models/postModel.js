'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PostSchema = new Schema({
  id_dish: {
    type: String,
    required: 'Id of dish in the post'
  },
  id_user: {
    type: String,
    required: 'Id of the user that post this post'
  },
  caption: {
    type: String,
    required: 'Enter the caption of the post'
  },
  loves: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  comments: {
    type: Array,
    default: [],
    required: 'Id of Comments in this post'
  },
  love_list: { 
    type: Array,
    default: [],
    required: 'List of id of user who love this post'
  }
  
});

module.exports = mongoose.model('Posts', PostSchema);