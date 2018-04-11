'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AchievementSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  }
  
});

module.exports = mongoose.model('Achievements', AchievementSchema);