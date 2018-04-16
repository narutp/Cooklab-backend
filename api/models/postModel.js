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
  },
  caption: {
    type: String,
  },
  trophies: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Moment().add(7,'hours')
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