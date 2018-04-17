'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DishSchema = new Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  level: {
    type: String,
    enum: ['1','2','3','4','5']
  },
  id_user: {
    type: String,
    ref: 'Users'
  },
  rate: {
    type: Number,
    default: 0
  },
  rate_list: {
    type: Array,
    default: []  
  },
  calories: {
    type: Number
  },
  image: { 
    type: String
  },
  recipe: {
    type: Array,
    default: []
  },
  ingredients: {
    type: Array,
    default: []
  },
  tags: {
    type: Array,
    default: []
  },
  type: {
    type: String,
    enum: ['normal', 'mydish', 'private'],
    default: 'normal'
  }
  
});

module.exports = mongoose.model('Dishes', DishSchema);