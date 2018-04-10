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
    enum: ['beginner', 'intermediate', 'senior', 'expert']
  },
  exp: {
    type: Number,
    default: 0
  },
  rate: {
    type: Number,
    default: 0
  },
  calories: {
    type: Number
  },
  image: { 
    type: String
  },
  recipe: {
    type: String
  },
  ingredients: {
    type: Array
  },
  tags: {
    type: Array,
    default: []
  },
  type: {
    type: String,
    enum: ['normal', 'mydish'],
    default: 'normal'
  }
  
});

module.exports = mongoose.model('Dishes', DishSchema);