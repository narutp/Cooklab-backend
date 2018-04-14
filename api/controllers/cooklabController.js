'use strict';
var passwordHash = require('password-hash');
var _ = require('lodash');

var mongoose = require('mongoose'),
  AchievementModel = mongoose.model('Achievements'),
  CommentModel = mongoose.model('Comments'),
  DishModel = mongoose.model('Dishes'),
  IngredientModel = mongoose.model('Ingredients'),
  PostModel = mongoose.model('Posts'),
  UserModel = mongoose.model('Users');

module.exports = {
  list_all_achievements: async (req, res) => {
    let achievementResponse = await AchievementModel.find({})
    res.json(achievementResponse)
  },

  create_new_achievement: async (req, res) => {
    let newAchievement = await new AchievementModel(req.body).save()
    res.json(newAchievement)
  },

  get_achievement: async (req, res) => {
    let achievementResponse = await AchievementModel.findById(req.query.achievementId)
    res.json(achievementResponse)
  },

  update_achievement: async (req, res) => {
    let achievementResponse = await AchievementModel.findOneAndUpdate({_id: req.body.achievementId}, req.body, {new: true})
    res.json(achievementResponse)
  },

  delete_achievement: async (req, res) => {
    let achievementResponse = await AchievementModel.remove({_id: req.body.achievementId})
    res.json({ message: 'Achievement successfully deleted' })
  },

  
}