'use strict';
var Compare = require('../util/compare');
var passwordHash = require('password-hash');

var mongoose = require('mongoose'),
  AchievementModel = mongoose.model('Achievements'),
  CommentModel = mongoose.model('Comments'),
  DishModel = mongoose.model('Dishes'),
  IngredientModel = mongoose.model('Ingredients'),
  PostModel = mongoose.model('Posts'),
  UserModel = mongoose.model('Users');

module.exports = {

  list_all_comments: function(req, res) {
    CommentModel.find({}, function(err, comment) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(comment);
      }
    });
  },
  
  list_all_posts: function(req, res) {
    PostModel.find({}, function(err, post) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(post);
      }
    });
  },
  
  create_new_comment: function(req, res) {
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
  },
  
  create_new_post: function(req, res) {
    var new_post = new PostModel(req.body);
    new_post.save(function(err, post) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(post);
      }
    });
  },
  
  get_comment: function(req, res) {
    CommentModel.findById(req.params.commentId, function(err, comment) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(comment);
      }
    });
  },
  
  get_post_by_post_id: function(req, res) {
    PostModel.findById(req.params.postId, function(err, post) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(post);
      }
    });
  },
  
  get_images_posts_by_user_id: function(req, res) {
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
  },
  
  update_comment: function(req, res) {
    CommentModel.findOneAndUpdate({_id: req.body.commentId}, req.body, {new: true}, function(err, comment) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(comment);
      }
    });
  },
  
  update_post: function(req, res) {
    PostModel.findOneAndUpdate({_id: req.body.postId}, req.body, {new: true}, function(err, post) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(post);
      }
    });
  },
  
  delete_comment: function(req, res) {
    var postId
    CommentModel.findOne({_id: req.body.commentId}, function(err, comment) {
      if (err) {
        res.send(err);
      }
      else {
        postId = comment.id_post
      }
    })
    CommentModel.remove({_id: req.body.commentId}, function(err, comment) {
      if (err) {
        res.send(err);
      }
      else {
        PostModel.findOne({_id: postId}, function(err, post) {
          if (err) {
            res.send(err);
          }
          else {
            var index = post.comments.indexOf(req.body.commentId)
            if (index > -1) {
              post.comments.splice(index, 1);
            }
            post.save()
          }
        })
        res.json({ message: 'Comment successfully deleted' });
      }
    });
  },
  
  delete_post: function(req, res) {
    var comments_arr
    PostModel.findOne({_id: req.body.postId},'comments', function(err, comments) {
      if (err) {
        res.send(err);
      }
      else {
        comments_arr = comments.comments
      }
    })
    PostModel.remove({_id: req.body.postId}, function(err, post) {
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
  },
  
  //Technically แล้ว มึงควรแก้ตั้งแต่ตอน Post ให้ query หา ชื่อ มาแปะ ใน .user (เปลี่ยน id_user เป็น user) แล้วข้างในเป็น JSON เก็บ id_user และ name
  
  get_feeds_by_user_id: async (req, res) => {
    let followingResponse = await UserModel.findOne({_id: req.query.userId}, 'followings')
    let followings_arr = followingResponse.followings
    followings_arr.push(req.query.userId)
    
    let postResponse = await PostModel.find({id_user: {$in: followings_arr}})
    let idUserFromPost = postResponse.map((post) => {
        return post.id_user
    })
    let usernameResponse = await UserModel.find({_id: {$in: idUserFromPost}})
  
    let returnResponse = []
    for(let i = 0; i< postResponse.length; i++) {
      
      let user = usernameResponse.filter((user) => {
        return postResponse[i].id_user == user._id
      })[0]
      let name = user.name
      let postDetail = {
        loves: postResponse[i].loves,
        comments: postResponse[i].comments,
        love_list: postResponse[i].love_list,
        timestamp: postResponse[i].timestamp,
        _id: postResponse[i]._id,
        id_dish: postResponse[i].id_dish,
        id_user: postResponse[i].id_user,
        image: postResponse[i].image,
        caption: postResponse[i].caption,
        user_name: user.name
      }
      returnResponse.push(postDetail)
    }
    returnResponse.sort(Compare.compare)
    return res.json(returnResponse)
  },
  
  get_top_feed: function(req, res) {
    PostModel.find({}).sort({'loves':-1}).limit(5).exec(function(err, posts) {
      if (err) {
        res.send(err)
      }
      else {
        res.json(posts)
      }
    });
  },
  
  love_post: function(req, res) {
    PostModel.findOne({_id: req.body.postId}, function(err, post) {
      if (err) {
        res.send(err)
      }
      else {
        post.loves++
        post.love_list.push(req.body.userId)
        post.save()
        res.json(post)
      }
    });
  },
  
  dislove_post: function(req, res) {
    PostModel.findOne({_id: req.body.postId}, function(err, post) {
      if (err) {
        res.send(err)
      }
      else {
        post.loves--
        var index = post.love_list.indexOf(req.body.userId)
        post.love_list.splice(index, 1)
        post.save()
        res.json(post)
      }
    })
  }
}

