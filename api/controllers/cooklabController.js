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
    return res.json(achievementResponse)
  },

  create_new_achievement: async (req, res) => {
    let newAchievement = await new AchievementModel(req.body).save()
    return res.json(newAchievement)
  },

  get_achievement: async (req, res) => {
    let achievementResponse = await AchievementModel.findById(req.query.achievementId)
    return res.json(achievementResponse)
  },

  update_achievement: async (req, res) => {
    let achievementResponse = await AchievementModel.findOneAndUpdate({_id: req.body.achievementId}, req.body, {new: true})
    return res.json(achievementResponse)
  },

  delete_achievement: async (req, res) => {
    let achievementResponse = await AchievementModel.remove({_id: req.body.achievementId})
    return res.json({ message: 'Achievement successfully deleted' })
  },

  search: async (req, res) => {
    let returnResponse = []
    let userResponse = await UserModel.find({name: {"$regex": req.query.text}},'name photo')
    for (let i=0; i<userResponse.length; i++) {
      let userResult = {
        _id: userResponse[i]._id,
        name: userResponse[i].name,
        image: userResponse[i].photo,
        type: 'user'
      }
      returnResponse.push(userResult)
    }
    let dishResponse = await DishModel.find({name: {"$regex": req.query.text},type: 'mydish'},'name image')
    for (let i=0; i<dishResponse.length; i++) {
      let dishResult = {
        _id: dishResponse[i]._id,
        name: dishResponse[i].name,
        image: dishResponse[i].image,
        type: 'dish'
      }
      returnResponse.push(dishResult)
    }
    return res.json(returnResponse)
  }

  
}