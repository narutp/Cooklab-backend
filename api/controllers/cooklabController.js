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

exports.list_all_achievements = function(req, res) {
  AchievementModel.find({}, function(err, achievement) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(achievement);
    }
  });
};

exports.create_new_achievement = function(req, res) {
  var new_achievement = new AchievementModel(req.body);
  new_achievement.save(function(err, achievement) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(achievement);
    }
  });
};

exports.get_achievement = function(req, res) {
  AchievementModel.findById(req.params.achievementId, function(err, achievement) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(achievement);
    }
  });
};

exports.update_achievement = function(req, res) {
  AchievementModel.findOneAndUpdate({_id: req.body.achievementId}, req.body, {new: true}, function(err, achievement) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(achievement);
    }
  });
};

exports.delete_achievement = function(req, res) {
  AchievementModel.remove({_id: req.body.achievementId}, function(err, achievement) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Achievement successfully deleted' });
    }
  });
};