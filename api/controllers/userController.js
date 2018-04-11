'use strict';
var passwordHash = require('password-hash');

var mongoose = require('mongoose'),
  AchievementModel = mongoose.model('Achievements'),
  CommentModel = mongoose.model('Comments'),
  DishModel = mongoose.model('Dishes'),
  IngredientModel = mongoose.model('Ingredients'),
  PostModel = mongoose.model('Posts'),
  UserModel = mongoose.model('Users');

module.exports = {
  list_all_users: function(req, res) {
    UserModel.find({}, function(err, user) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(user);
      }
    });
  },
  
  create_new_user: function(req, res) {
    UserModel.find({username : req.body.username}, function (err, user) {
      if (user.length){
          res.json(true)
      }else{
        var new_user = new UserModel(req.body);
        new_user.save(function(err, newuser) {
          if (err) {
            res.send(err);
          }
          else {
            UserModel.find({_id : newuser._id}, function (err, newUser) {
              if (err) {
                res.send(err);
              }
              else { 
                var hashedPassword = passwordHash.generate(newuser.password);
                new_user.password = hashedPassword
                new_user.save()
                res.json(true);
              }
            })
          }
        });
      }
    })  
  },
  
  get_user: function(req, res) {
    UserModel.findById(req.params.userId, function(err, user) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(user);
      }
    });
  },
  
  update_user: function(req, res) {
    UserModel.findOneAndUpdate({_id: req.body.userId}, req.body, {new: true}, function(err, user) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(user);
      }
    });
  },
  
  delete_user: function(req, res) {
    UserModel.remove({_id: req.body.userId}, function(err, user) {
      if (err) {
        res.send(err);
      }
      else {
        res.json({ message: 'User successfully deleted' });
      }
    });
  },
  
  follow_user: function(req, res) {
    UserModel.findOne({_id: req.body.userId}, function(err, user) {
      if (err) {
        res.send(err);
      }
      else {
        console.log(user)
        user.followings.push(req.body.targetId)
        user.save()
      }
    });
    UserModel.findOne({_id: req.body.targetId}, function(err, targetUser) {
      if (err) {
        res.send(err);
      }
      else {
        targetUser.fans.push(req.body.userId)
        targetUser.save()
        res.json(targetUser)
      }
    });
  },
  
  unfollow_user: function(req, res) {
    UserModel.findOne({_id: req.body.userId}, function(err, user) {
      if (err) {
        res.send(err);
      }
      else {
        var index = user.followings.indexOf(req.body.targetId)
        if (index > -1) {
          user.followings.splice(index, 1);
        }
        user.save()
      }
    });
    UserModel.findOne({_id: req.body.targetId}, function(err, targetUser) {
      if (err) {
        res.send(err);
      }
      else {
        var index = targetUser.fans.indexOf(req.body.userId)
        if (index > -1) {
          targetUser.fans.splice(index, 1);
        }
        targetUser.save()
        res.json(targetUser)
      }
    });
  },
  
  login_by_username_and_password: function(req, res) {
    UserModel.findOne({username: req.body.username}, function(err, user) {
      if(err) {
        res.send(err)
      }
      else {
        let password = user.password
        let result = passwordHash.verify(req.body.password, password);
        res.json(result)
      }
    });
  },
  
  delete_all_user: function(req, res) {
    UserModel.remove({}, function(err,user) {
      if (err) {
        console.log(err)
      } else {
        res.end('success');
      }
    });
  },
  
  get_id_user_by_username: function(req, res) {
    UserModel.findOne({username: req.query.username}, function(err, user) {
      if (err) {
        console.log(err)
      } else {
        res.json(user._id);
      }
    })
  }
}