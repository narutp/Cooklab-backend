'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AchievementSchema = new Schema({
  name: {
    type: String,
    required: 'Name of the achievement'
  },
  description: {
    type: String,
    required: 'Description of the achievement'
  }
  
});

module.exports = mongoose.model('Achievements', AchievementSchema);