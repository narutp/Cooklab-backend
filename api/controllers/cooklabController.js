'use strict';
var passwordHash = require('password-hash');

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

exports.list_all_comments = function(req, res) {
  CommentModel.find({}, function(err, comment) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(comment);
    }
  });
};

exports.list_all_dishes = function(req, res) {
  DishModel.find({}, function(err, dish) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(dish);
    }
  });
};

exports.list_all_ingredients = function(req, res) {
  IngredientModel.find({}, function(err, ingredient) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(ingredient);
    }
  });
};

exports.list_all_posts = function(req, res) {
  PostModel.find({}, function(err, post) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(post);
    }
  });
};

exports.list_all_users = function(req, res) {
  UserModel.find({}, function(err, user) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(user);
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

exports.create_new_comment = function(req, res) {
  var new_comment = new CommentModel(req.body);
  new_comment.save(function(err, comment) {
    if (err) {
      res.send(err);
    }
    else {
      PostModel.findOne({_id: new_comment.id_post},function(err, post) {
        if (err) {
          res.send(err);
        }
        else {
          post.comments.push(new_comment._id)
          post.save()
          res.json(new_comment);
        }
      })
    }
  });
};

exports.create_new_dish = function(req, res) {
  var new_dish = new DishModel(req.body);
  new_dish.save(function(err, dish) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(dish);
    }
  });
};

exports.create_new_ingredient = function(req, res) {
  var new_ingredient = new IngredientModel(req.body);
  new_ingredient.save(function(err, ingredient) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(ingredient);
    }
  });
};

exports.create_new_post = function(req, res) {
  var new_post = new PostModel(req.body);
  new_post.save(function(err, post) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(post);
    }
  });
};

exports.create_new_user = function(req, res) {
  var new_user = new UserModel(req.query);
  new_user.save(function(err, user) {
    console.log(err)
    if (err) {
      res.send(err);
    }
    else {
      res.json(user);
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

exports.get_comment = function(req, res) {
  CommentModel.findById(req.params.commentId, function(err, comment) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(comment);
    }
  });
};

exports.get_dish = function(req, res) {
  DishModel.findById(req.params.dishId, function(err, dish) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(dish);
    }
  });
};

exports.get_ingredient = function(req, res) {
  IngredientModel.findById(req.params.ingredientId, function(err, ingredient) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(ingredient);
    }
  });
};

exports.get_post_by_post_id = function(req, res) {
  PostModel.findById(req.params.postId, function(err, post) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(post);
    }
  });
};

exports.get_images_posts_by_user_id = function(req, res) {
  PostModel.find({'id_user': req.params.userId},'id_dish', function(err, post) {
    if (err) {
      res.send(err);
    }
    else {
      var id_dish_arr = []
      post.forEach((p) => {
        id_dish_arr.push(p.id_dish)
      })
      DishModel.find({_id: {$in: id_dish_arr}},'image', function(err, dish) {
        if (err) {
          res.send(err);
        }
        else {
          var image_arr = []
          dish.forEach((d) => {
            image_arr.push(d.image)
          })
          res.json(image_arr);
        }
      })
    }
  });
};

exports.get_user = function(req, res) {
  UserModel.findById(req.params.userId, function(err, user) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(user);
    }
  });
};

exports.update_achievement = function(req, res) {
  AchievementModel.findOneAndUpdate({_id: req.params.achievementId}, req.body, {new: true}, function(err, achievement) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(achievement);
    }
  });
};

exports.update_comment = function(req, res) {
  CommentModel.findOneAndUpdate({_id: req.params.commentId}, req.body, {new: true}, function(err, comment) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(comment);
    }
  });
};

exports.update_dish = function(req, res) {
  DishModel.findOneAndUpdate({_id: req.params.dishId}, req.body, {new: true}, function(err, dish) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(dish);
    }
  });
};

exports.update_ingredient = function(req, res) {
  IngredientModel.findOneAndUpdate({_id: req.params.ingredientId}, req.body, {new: true}, function(err, ingredient) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(ingredient);
    }
  });
};

exports.update_post = function(req, res) {
  PostModel.findOneAndUpdate({_id: req.params.postId}, req.body, {new: true}, function(err, post) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(post);
    }
  });
};

exports.update_user = function(req, res) {
  UserModel.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, function(err, user) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(user);
    }
  });
};

exports.delete_achievement = function(req, res) {
  AchievementModel.remove({_id: req.params.achievementId}, function(err, achievement) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Achievement successfully deleted' });
    }
  });
};

exports.delete_comment = function(req, res) {
  var postId
  CommentModel.findOne({_id: req.params.commentId}, function(err, comment) {
    if (err) {
      res.send(err);
    }
    else {
      postId = comment.id_post
    }
  })
  CommentModel.remove({_id: req.params.commentId}, function(err, comment) {
    if (err) {
      res.send(err);
    }
    else {
      PostModel.findOne({_id: postId}, function(err, post) {
        if (err) {
          res.send(err);
        }
        else {
          var index = post.comments.indexOf(req.params.commentId)
          if (index > -1) {
            post.comments.splice(index, 1);
          }
          post.save()
        }
      })
      res.json({ message: 'Comment successfully deleted' });
    }
  });
};

exports.delete_dish = function(req, res) {
  DishModel.remove({_id: req.params.dishId}, function(err, dish) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Dish successfully deleted' });
    }
  });
};

exports.delete_ingredient = function(req, res) {
  IngredientModel.remove({_id: req.params.ingredientId}, function(err, ingredient) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Ingredient successfully deleted' });
    }
  });
};

exports.delete_post = function(req, res) {
  var comments_arr
  PostModel.findOne({_id: req.params.postId},'comments', function(err, comments) {
    if (err) {
      res.send(err);
    }
    else {
      comments_arr = comments.comments
    }
  })
  PostModel.remove({_id: req.params.postId}, function(err, post) {
    if (err) {
      res.send(err);
    }
    else {      
      CommentModel.remove({_id: {$in: comments_arr}}, function(err, comment) {
        if (err) {
          res.send(err);
        }
        else {
          res.json({ message: 'Post and comment successfully deleted' });
        }
      })
    }
  });
};

exports.delete_user = function(req, res) {
  UserModel.remove({_id: req.params.userId}, function(err, user) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'User successfully deleted' });
    }
  });
};

exports.follow_user = function(req, res) {
  UserModel.findOne({_id: req.params.userId}, function(err, user) {
    if (err) {
      res.send(err);
    }
    else {
      user.followings.push(req.params.targetId)
      user.save()
    }
  });
  UserModel.findOne({_id: req.params.targetId}, function(err, targetUser) {
    if (err) {
      res.send(err);
    }
    else {
      targetUser.fans.push(req.params.userId)
      targetUser.save()
      res.json(targetUser)
    }
  });
};

exports.unfollow_user = function(req, res) {
  UserModel.findOne({_id: req.params.userId}, function(err, user) {
    if (err) {
      res.send(err);
    }
    else {
      var index = user.followings.indexOf(req.params.targetId)
      if (index > -1) {
        user.followings.splice(index, 1);
      }
      user.save()
    }
  });
  UserModel.findOne({_id: req.params.targetId}, function(err, targetUser) {
    if (err) {
      res.send(err);
    }
    else {
      var index = targetUser.fans.indexOf(req.params.userId)
      if (index > -1) {
        targetUser.fans.splice(index, 1);
      }
      targetUser.save()
      res.json(targetUser)
    }
  });
};

exports.get_feeds_by_user_id = function(req, res) {
  UserModel.findOne({_id: req.params.userId},'followings', function(err, followings) {
    if (err) {
      res.send(err)
    }
    else {
      var followings_arr = followings.followings
      PostModel.find({id_user: {$in: followings_arr}}, function(err, post) {
        if (err) {
          res.send(err);
        }
        else {
          var post_arr = []
          post.forEach((p) => {
            post_arr.push(p)
          })
          post_arr.sort(compare)
          res.json(post_arr)
        }
      })
    }
  });
};

exports.get_top_feed = function(req, res) {
  PostModel.find({}).sort({'loves':-1}).limit(5).exec(function(err, posts) {
    if (err) {
      res.send(err)
    }
    else {
      res.json(posts)
    }
  });
};

exports.love_post = function(req, res) {
  PostModel.findOne({_id: req.params.postId}, function(err, post) {
    if (err) {
      res.send(err)
    }
    else {
      post.loves++
      post.love_list.push(req.params.userId)
      post.save()
      res.json(post)
    }
  });
};

exports.dislove_post = function(req, res) {
  PostModel.findOne({_id: req.params.postId}, function(err, post) {
    if (err) {
      res.send(err)
    }
    else {
      post.loves--
      var index = post.love_list.indexOf(req.params.userId)
      post.love_list.splice(index, 1)
      post.save()
      res.json(post)
    }
  });
};

exports.login_by_username_and_password = function(req, res) {
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
}



function compare(a,b) {
  if (a.timestamp < b.timestamp)
    return 1;
  if (a.timestamp > b.timestamp)
    return -1;
  return 0;
}