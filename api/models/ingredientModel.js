'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var IngredientSchema = new Schema({
  name: {
    type: String,
  },
  unit: {
    type: String,
  },
  quantity: {
    type: Number,
  }
  
});

module.exports = mongoose.model('Ingredients', IngredientSchema);