'use strict';
var passwordHash = require('password-hash')
var Random = require('../util/random')

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
    userResponse.followings.push(req.body.targetId)
    await userResponse.save()
    let targetUserResponse = await UserModel.findOne({_id: req.body.targetId})
    targetUserResponse.fans.push(req.body.userId)
    await targetUserResponse.save()
    return res.json(targetUserResponse)
  },
  
  unfollow_user: async (req, res) => {
    let userResponse = await UserModel.findOne({_id: req.body.userId})
    let index = userResponse.followings.indexOf(req.body.targetId)
    if (index > -1) {
      userResponse.followings.splice(index, 1);
    }
    await userResponse.save()
    let targetUserResponse = await UserModel.findOne({_id: req.body.targetId})
    index = targetUserResponse.fans.indexOf(req.body.userId)
    if (index > -1) {
      targetUserResponse.fans.splice(index, 1);
    }
    await targetUserResponse.save()
    return res.json(targetUserResponse)
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
  }
}