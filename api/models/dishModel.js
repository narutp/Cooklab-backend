'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DishSchema = new Schema({
  name: {
    type: String,
    required: 'Name of the dish'
  },
  description: {
    type: String,
    required: 'Description of the dish'
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'senior', 'expert']
  },
  score: {
    type: Number,
    default: 0
  },
  rate: {
    type: Number,
    default: 0
  },
  calories: {
    type: Number,
    required: 'Calories of the dish'
  },
  image: { 
    type: String,
    required: 'URL of image of the dish'
  },
  recipe: {
    type: String,
    required: 'Recipe of the dish'
  },
  ingredients: {
    type: Array,
    required: 'Ingredients of the dish'
  },
  tags: {
    type: Array,
    default: []
  }
  
});

module.exports = mongoose.model('Dishes', DishSchema);