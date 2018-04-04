'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var IngredientSchema = new Schema({
  name: {
    type: String,
    required: 'Name of the ingredient'
  },
  unit: {
    type: String,
    required: 'Unit of the ingredient'
  },
  quantity: {
    type: Number,
    required: 'Quantity of the ingredient'
  }
  
});

module.exports = mongoose.model('Ingredients', IngredientSchema);