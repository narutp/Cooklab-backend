'use strict';
var mongoose = require('mongoose');
var Moment = require('moment')
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  id_dish: {
    type: String,
  },
  id_user: {
    type: String,
    ref: 'Users'
  },
  caption: {
    type: String,
  },
  trophies: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date
  },
  comments: {
    type: Array,
    default: []
  },
  trophy_list: { 
    type: Array,
    default: []
  },
  image: {
    type: String
  }
  
});

module.exports = mongoose.model('Posts', PostSchema);