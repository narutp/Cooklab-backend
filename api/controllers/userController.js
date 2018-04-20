'use strict';
var passwordHash = require('password-hash')
var Random = require('../util/random')
var momentTz = require('moment-timezone');

var mongoose = require('mongoose'),
  AchievementModel = mongoose.model('Achievements'),
  CommentModel = mongoose.model('Comments'),
  DishModel = mongoose.model('Dishes'),
  IngredientModel = mongoose.model('Ingredients'),
  PostModel = mongoose.model('Posts'),
  UserModel = mongoose.model('Users')

module.exports = {
  list_all_users: async (req, res) => {
    let userResponse = await UserModel.find({})
    return res.json(userResponse)
  },
  
  create_new_user: async (req, res) => {
    let userResponse = await UserModel.find({},'username')
    let usernameFromResponse = userResponse.map((user) => {
      return user.username
    })
    if (usernameFromResponse.indexOf(req.body.username) > -1){
      return res.json(false)
    }
    let newUser = new UserModel(req.body);
    let hashedPassword = passwordHash.generate(req.body.password);
    newUser.password = hashedPassword
    await newUser.save()
    return res.json(true)
  },
  
  get_user: async (req, res) => {
    let userResponse = await UserModel.findById(req.query.userId)
    return res.json(userResponse)
  },
  
  update_user: async (req, res) => {
    let userResponse = await UserModel.findOneAndUpdate({_id: req.body.userId}, req.body, {new: true})
    return res.json(userResponse)
  },
  
  delete_user: async (req, res) => {
    let userResponse = await UserModel.remove({_id: req.body.userId})
    return res.json({ message: 'User successfully deleted' })
  },
  
  follow_user: async (req, res) => {
    let userResponse = await UserModel.findOne({_id: req.body.userId})
    let index = userResponse.followings.indexOf(req.body.targetId)
    let status
    if (index > -1) {
      userResponse.followings.splice(index, 1);
      await userResponse.save()
      let targetUserResponse = await UserModel.findOne({_id: req.body.targetId})
      index = targetUserResponse.fans.indexOf(req.body.userId)
      targetUserResponse.fans.splice(index, 1);
      await targetUserResponse.save()
      status = 'unfollow'
    } 
    else {
      userResponse.followings.push(req.body.targetId)
      await userResponse.save()
      let targetUserResponse = await UserModel.findOne({_id: req.body.targetId})
      targetUserResponse.fans.push(req.body.userId)
      await targetUserResponse.save()
      status = 'follow'
    }
    return res.json(status)
  },
  
  login_by_username_and_password: async (req, res) => {
    let userResponse = await UserModel.findOne({username: req.body.username})
    let password = userResponse.password
    let result = passwordHash.verify(req.body.password, password);
    return res.json(result)
  },
  
  delete_all_user: async (req, res) => {
    let userResponse = await UserModel.remove({})
    return res.end('success')
  },
  
  get_id_user_by_username: async (req, res) => {
    let userResponse = await UserModel.findOne({username: req.query.username})
    return res.json(userResponse._id)
  },

  login_with_facebook: async (req, res) => {
    let userResponse = await UserModel.find({},'username')
    let usernameFromResponse = userResponse.map((user) => {
      return user.username
    })
    if (usernameFromResponse.indexOf(req.body.username) > -1){
      return res.json(true)
    }
    let newUser = new UserModel(req.body);
    let hashedPassword = passwordHash.generate(Random.random(20));
    newUser.password = hashedPassword
    await newUser.save()
    return res.json(true)
  },

  count_trophy_and_dish: async (req, res) => {
    let countDish = await DishModel.count({id_user: req.query.user_id, type: 'mydish'})
    let dishResponse = await DishModel.find({id_user: req.query.user_id})
    let postResponse = await PostModel.find({id_dish: {$in: dishResponse._id}},'trophies')
    let countTrophy = 0
    postResponse.forEach((post) => {
      countTrophy += post.trophies
    })
    let returnResponse = {
      dish: countDish,
      trophy: countTrophy
    }
    return res.json(returnResponse)
  },

  get_following_and_fan_by_user_id: async (req, res) => {
    let userResponse = await UserModel.findOne({_id: req.query.user_id})
    let followings = userResponse.followings
    let fans = userResponse.fans
    let followingResponse = await UserModel.find({_id: {$in: followings}}, 'name photo')
    let fanResponse = await UserModel.find({_id: {$in: fans}}, 'name photo')
    let fanList = []
    for (let i=0; i<fanResponse.length; i++) {
      let status
      status = followings.indexOf(fanResponse[i]._id) > -1
      let fan = {
        photo: fanResponse[i].photo,
        _id: fanResponse[i]._id,
        name: fanResponse[i].name,
        status: status
      }
      fanList.push(fan)
    }
    
    let returnResponse = {
      following: followingResponse,
      fan: fanList
    }
    return res.json(returnResponse)
  }
}