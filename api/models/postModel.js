'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PostSchema = new Schema({
  id_dish: {
    type: String,
  },
  id_user: {
    type: String,
  },
  caption: {
    type: String,
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
  },
  love_list: { 
    type: Array,
    default: [],
  },
  image: {
    type: String
  }
  
});

module.exports = mongoose.model('Posts', PostSchema);