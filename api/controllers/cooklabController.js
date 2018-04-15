'use strict';
var passwordHash = require('password-hash');
var _ = require('lodash');
var Compare = require('../util/compare');
var Moment = require('moment')

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
    let userResponse = await UserModel.find({name: {"$regex": req.query.text, $options: 'si'}},'name photo')
    for (let i=0; i<userResponse.length; i++) {
      let userResult = {
        _id: userResponse[i]._id,
        name: userResponse[i].name,
        image: userResponse[i].photo,
        type: 'user'
      }
      returnResponse.push(userResult)
    }
    let dishResponse = await DishModel.find({name: {"$regex": req.query.text, $options: 'si'},type: 'mydish'},'name image')
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
  },

  get_most_post_user: async (req, res) => {
    let userResponse = await UserModel.find({},'name photo')
    let idUserFromResponse = userResponse.map((user) => {
      return user._id
    })
    let countList = []
    for (let i=0; i<idUserFromResponse.length; i++) {
      let count = 0
      let postResponse = await PostModel.find({id_user: idUserFromResponse[i] },'id_dish')
      let idDishFromPost = postResponse.map((post) => {
        return post.id_dish
      })
      let dishResponse = await DishModel.find({_id: {$in: idDishFromPost}}, 'type')
      for (let j=0; j<dishResponse.length; j++) {
        if (dishResponse[j].type == 'mydish') {
          count++
        }
      }
      countList.push({
        id_user: idUserFromResponse[i],
        count: count,
        name: userResponse[i].name,
        image: userResponse[i].photo
      })
    }
    countList.sort(Compare.compareByCount)
    return res.json(countList)
  }

  // เดี๋ยวทำ map reduce ต่อนาจา
  // get_most_trophy_user: async (req, res) => {
  //   console.log(Moment().toLocaleString())
  //   let startTime = Moment().startOf('day').subtract(7,'hours')
  //   let endTime = Moment().endOf('day').subtract(7,'hours')
  //   let postResponse = await PostModel.find({}).where('timestamp').gt(startTime).lt(endTime).exec()
    
  //   return res.json(postResponse)
  // }
  
}