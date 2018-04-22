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
  UserModel = mongoose.model('Users'),
  NotificationModel = mongoose.model('Notification')

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
    let userList = []
    let userResponse
    if (req.query.user_id) {
      let followingResponse = await UserModel.findOne({_id: req.query.user_id}, 'followings')
      let followings = followingResponse.followings
      followings.push(req.query.user_id)
      userResponse = await UserModel.find({_id: {$in: followings}},'name photo rank')
    }
    else {
      userResponse = await UserModel.find({},'name photo rank')
    }
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
        image: userResponse[i].photo,
        rank: userResponse[i].rank
      })
    }
    countList.sort(Compare.compareByCount)
    return res.json(countList)
  },

  get_most_trophy_user: async (req, res) => {
    let followings = []
    if (req.query.user_id) {
      let followingResponse = await UserModel.findOne({_id: req.query.user_id}, 'followings')
      followings = followingResponse.followings
      followings.push(req.query.user_id)
    }
    let startTime = Moment().startOf('month').subtract(7,'hours')
    let endTime = Moment().endOf('month').subtract(7,'hours')
    let postResponse = await PostModel.find({}).where('timestamp').gt(startTime).lt(endTime).exec()
    let userTrophy = []
    // ตรองมาดูตรงนี้
    for (let i=0; i<postResponse.length; i++) {
      let post = postResponse[i]
      if (req.query.user_id) {
        if (followings.indexOf(post.id_user) <= -1) {
          continue
        }
      }
      let trophies = 0
      let index = userTrophy.findIndex((data) => {
        return data.user_id === post.id_user
      })
      if (index > -1) {
        // trophies = userTrophy[index].trophies
        // userTrophy.splice(index,1)
        userTrophy[index].trophies += post.trophies 
      }
      else {
        let userResponse = await UserModel.findOne({_id: post.id_user}, 'name photo rank')
        let obj = {
          user_id: post.id_user,
          name: userResponse.name,
          trophies: trophies,
          image: userResponse.photo,
          rank: userResponse.rank
        }
        userTrophy.push(obj)
      }
      // trophies += post.trophies
      
    }
    userTrophy.sort(Compare.compareByTrophy)
    return res.json(userTrophy)
  },

  get_most_rank_user: async (req,res) => {
    let userList = []
    if(req.query.user_id) {
      let followingResponse = await UserModel.findOne({_id: req.query.user_id}, 'followings')
      let followings = followingResponse.followings
      followings.push(req.query.user_id)
      followingResponse = await UserModel.find({_id: {$in: followings}}, 'name photo experience rank')
      userList = followingResponse
    }
    else {
      let userResponse = await UserModel.find({}, 'name photo experience rank')
      userList = userResponse
    }
    userList.sort(Compare.compareByExp)
    return res.json(userList)
  }
  
}