'use strict';
var Compare = require('../util/compare');
var passwordHash = require('password-hash');
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

  list_all_comments: async (req, res) => {
    let commentResponse = await CommentModel.find({})
    return res.json(commentResponse)
  },
  
  list_all_posts: async (req, res) => {
    let postResponse = await PostModel.find({})
    return res.json(postResponse)
  },
  
  create_new_comment: async (req, res) => {
    if (req.body.text == "") {
      return res.json(false)
    }
    let newComment = new CommentModel(req.body)
    let timestamp = Date.now()
    newComment.timestamp = timestamp
    await newComment.save()
    let postResponse = await PostModel.findOne({_id: newComment.id_post})
    postResponse.comments.push(newComment._id)
    await postResponse.save()
    return res.json(newComment)
  },

  create_new_notification: async (req, res) => {
    let postResponse = await PostModel.findOne({_id: req.body.id_post})
    let id_target = postResponse.id_user
    if (id_target == req.body.id_user) {
      return res.json(false)
    }
    let newNotification = new NotificationModel(req.body)
    let timestamp = Date.now()
    newNotification.timestamp = timestamp
    newNotification.id_target = id_target
    await newNotification.save()
    let userResponse = await UserModel.findOne({_id: req.body.id_target})
    userResponse.noti_status = false
    await userResponse.save()
    return res.json(true)
  },
  
  create_new_post: async (req, res) => {
    let newPost = new PostModel(req.body)
    let timestamp = Date.now()
    newPost.timestamp = timestamp
    await newPost.save()
    let dishResponse = await DishModel.findById(newPost.id_dish)
    if (dishResponse.type != 'normal') {
      let dishLevel = dishResponse.level
      let exp, limit
      if (dishLevel == '1')
        exp = 10
      else if (dishLevel == '2')
        exp = 15
      else if (dishLevel == '3')
        exp = 25
      else if (dishLevel == '4')
        exp = 40
      else
        exp = 60
      let userResponse = await UserModel.findById(newPost.id_user)
      userResponse.experience += exp
      if (userResponse.experience >= 10000) {
        userResponse.experience = 10000
      }
      await userResponse.save()
      let userExp = userResponse.exp
      if (userExp >= 10000)
        userResponse.rank = '15'
      else if (userExp >= 7500)
        userResponse.rank = '14'
      else if (userExp >= 5500)
        userResponse.rank = '13'
      else if (userExp >= 4000)
        userResponse.rank = '12'
      else if (userExp >= 3000)
        userResponse.rank = '11'
      else if (userExp >= 2200)
        userResponse.rank = '10'
      else if (userExp >= 1600)
        userResponse.rank = '9'
      else if (userExp >= 1100)
        userResponse.rank = '8'
      else if (userExp >= 700)
        userResponse.rank = '7'
      else if (userExp >= 400)
        userResponse.rank = '6'
      else if (userExp >= 200)
        userResponse.rank = '5'
      else if (userExp >= 120)
        userResponse.rank = '4'
      else if (userExp >= 70)
        userResponse.rank = '3'
      else if (userExp >= 30)
        userResponse.rank = '2'
      else
        userResponse.rank = '1'
      await userResponse.save()
    }
    return res.json(newPost)
  },
  
  get_comment: async (req, res) => {
    let commentResponse = await CommentModel.findById(req.query.commentId)
    return res.json(commentResponse)
  },
  
  get_post_by_post_id: async (req, res) => {
    let postResponse = await PostModel.findById(req.query.postId)
    return res.json(postResponse)
  },
  
  get_image_post_by_user_id: async (req, res) => {
    let postResponse = await PostModel.find({ id_user: req.query.user_id},'id_dish')
    let idDishFromPost = postResponse.map((post) => {
      return post.id_dish
    })
    let dishResponse = await DishModel.find({_id: {$in: idDishFromPost}},'image')
    return res.json(dishResponse)
  },
  
  update_comment: async (req, res) => {
    let commentResponse = await CommentModel.findOneAndUpdate({_id: req.body.commentId}, req.body, {new: true})
    return res.json(commentResponse)
  },
  
  update_post: async (req, res) => {
    let postResponse = await PostModel.findOneAndUpdate({_id: req.body.postId}, req.body, {new: true})
    return res.json(postResponse)
  },
  
  delete_comment: async (req, res) => {
    let commentResponse = await CommentModel.findOne({_id: req.body.commentId})
    let postId = commentResponse.id_post
    commentResponse = await CommentModel.remove({_id: req.body.commentId})
    let postResponse = await PostModel.findOne({_id: postId})
    let index = postResponse.comments.indexOf(req.body.commentId)
    if (index > -1) {
      postResponse.comments.splice(index, 1)
    }
    await postResponse.save()
    return res.json({ message: 'Comment successfully deleted' })
  },
  
  delete_post: async (req, res) => {
    let postResponse = await PostModel.findOne({_id: req.body.postId},'comments')
    let commentFromPost = postResponse.comments
    postResponse = await PostModel.remove({_id: req.body.postId})    
    let commentResponse = await CommentModel.remove({_id: {$in: commentFromPost}})
    return res.json({ message: 'Post and comment successfully deleted' })
  },
  
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
    let idUserFromCommentResponse
    for(let i = 0; i< postResponse.length; i++) {
      let dishResponse = await DishModel.findOne({_id: postResponse[i].id_dish}, 'type')
      let userNameFromCommentResponse = []
      let user = usernameResponse.filter((user) => {
        return postResponse[i].id_user == user._id
      })[0]
      let commentResponse = await CommentModel.find({_id: {$in: postResponse[i].comments}})
      let idUserFromComment = commentResponse.map((comment) => {
        return comment.id_user
      })
      for (let j = 0; j<idUserFromComment.length ; j++) {
        let userResponse = await UserModel.findOne({_id: idUserFromComment[j]})
        userNameFromCommentResponse.push(userResponse)
      }
      
      let name = user.name
      let status = (postResponse[i].trophy_list.indexOf(req.query.userId) > -1)
      let commentArr = [], comment

      for (let j = 0; j< userNameFromCommentResponse.length; j++) {
        let image = userNameFromCommentResponse[j].photo
        let text = commentResponse[j].text
        
        comment = {
          id_user: userNameFromCommentResponse[j]._id,
          name: userNameFromCommentResponse[j].name,
          text: text,
          image: image
        }
        commentArr.push(comment)
      }
      let postDetail = {
        trophies: postResponse[i].trophies,
        comments: commentArr,
        trophy_list: postResponse[i].trophy_list,
        timestamp: postResponse[i].timestamp,
        _id: postResponse[i]._id,
        id_dish: postResponse[i].id_dish,
        id_user: postResponse[i].id_user,
        image: postResponse[i].image,
        caption: postResponse[i].caption,
        user_name: user.name,
        photo: user.photo,
        status: status,
        type: dishResponse.type
      }
      returnResponse.push(postDetail)
    }
    returnResponse.sort(Compare.compareByDate)
    returnResponse.splice(15,returnResponse.length-15)
    return res.json(returnResponse)
  },
  
  get_top_feed: async (req, res) => {
    // let postResponse = await PostModel.find({}).sort({'trophies':-1}).limit(20).exec()
    // for(let i = 0; i< postResponse.length; i++) {
    //   let commentResponse = await CommentModel.find({_id: {$in: postResponse[i].comments}}).populate('id_user')
    //   console.log(commentResponse)

    // }
    // return res.json(true)
    
    
    
    let postResponse = await PostModel.find({}).sort({'trophies':-1}).limit(20).exec()
    let idUserFromPost = postResponse.map((post) => {
      return post.id_user
    })
    let usernameResponse = await UserModel.find({_id: {$in: idUserFromPost}})
    let returnResponse = []
    let idUserFromCommentResponse
    for(let i = 0; i< postResponse.length; i++) {
      let dishResponse = await DishModel.findOne({_id: postResponse[i].id_dish}, 'type')
      let userNameFromCommentResponse = []
      let user = usernameResponse.filter((user) => {
        return postResponse[i].id_user == user._id
      })[0]
      let commentResponse = await CommentModel.find({_id: {$in: postResponse[i].comments}})
      let idUserFromComment = commentResponse.map((comment) => {
        return comment.id_user
      })
      for (let j = 0; j<idUserFromComment.length ; j++) {
        let userResponse = await UserModel.findOne({_id: idUserFromComment[j]})
        userNameFromCommentResponse.push(userResponse)
      }
      
      let name = user.name
      let status = (postResponse[i].trophy_list.indexOf(req.query.userId) > -1)
      let commentArr = [], comment

      for (let j = 0; j< userNameFromCommentResponse.length; j++) {
        let image = userNameFromCommentResponse[j].photo
        let text = commentResponse[j].text
        
        comment = {
          id_user: userNameFromCommentResponse[j]._id,
          name: userNameFromCommentResponse[j].name,
          text: text,
          image: image
        }
        commentArr.push(comment)
      }
      let postDetail = {
        trophies: postResponse[i].trophies,
        comments: commentArr,
        trophy_list: postResponse[i].trophy_list,
        timestamp: postResponse[i].timestamp,
        _id: postResponse[i]._id,
        id_dish: postResponse[i].id_dish,
        id_user: postResponse[i].id_user,
        image: postResponse[i].image,
        caption: postResponse[i].caption,
        user_name: user.name,
        photo: user.photo,
        status: status,
        type: dishResponse.type
      }
      returnResponse.push(postDetail)
    }
    returnResponse.sort(Compare.compareByTrophy)
    return res.json(returnResponse)
  },
  
  increase_trophy: async (req, res) => {
    let postResponse = await PostModel.findOne({_id: req.body.postId})
    if (postResponse.trophy_list.indexOf(req.body.userId) > -1) {
      return res.json(post)
    }
    postResponse.trophies++
    postResponse.trophy_list.push(req.body.userId)
    await postResponse.save()
    return res.json(postResponse)
  },
  
  decrease_trophy: async (req, res) => {
    let postResponse = await PostModel.findOne({_id: req.body.postId})
    if (postResponse.trophy_list.indexOf(req.body.userId) <= -1) {
      return res.json(postResponse)
    }
    let index = postResponse.trophy_list.indexOf(req.body.userId)
    postResponse.trophy_list.splice(index, 1)
    postResponse.trophies--
    await postResponse.save()
    return res.json(postResponse)
  },

  delete_all_post: async (req, res) => {
    let postResponse = await PostModel.remove({})
    return res.end('success');
  },

  delete_all_comment: async (req, res) => {
    let commentResponse = await CommentModel.remove({})
    return res.end('success');
  },

  get_comment_by_post_id: async (req, res) => {
    let returnResponse = []
    let postResponse = await PostModel.findOne({_id: req.query.post_id}, 'comments')
    let comments = postResponse.comments
    let commentResponse = await CommentModel.find({_id: {$in: comments}})
    let idUserFromComment = commentResponse.map((comment) => {
      return comment.id_user
    })
    let nameList = []
    let photoList = []
    for (let i=0; i<idUserFromComment.length; i++) {
      let userResponse = await UserModel.findOne({_id: idUserFromComment[i]}, 'name photo')
      nameList.push(userResponse.name)
      photoList.push(userResponse.photo)
    }
    for (let i=0; i<idUserFromComment.length; i++) {
      let comment = {
        id_user: idUserFromComment[i],
        name: nameList[i],
        image: photoList[i],
        text: commentResponse[i].text,
        timestamp: commentResponse[i].timestamp
      }
      returnResponse.push(comment)
    }
    return res.json(returnResponse)
  },

  get_notification_by_user_id: async (req, res) => {
    let returnResponse = []
    let notificationResponse = await NotificationModel.find({id_target: req.query.user_id})
    for (let i=0; i<notificationResponse.length; i++) {
      let userResponse = await UserModel.findOne({_id: notificationResponse[i].id_user},'name photo')
      let notification = {
        image: userResponse.photo,
        name: userResponse.name,
        type: notificationResponse[i].type,
        id_post: notificationResponse[i].id_post,
        timestamp: notificationResponse[i].timestamp
      }
      returnResponse.push(notification)
    }
    returnResponse.sort(Compare.compareByDate)
    let ownerResponse = await UserModel.findOne({_id: req.query.user_id})
    ownerResponse.noti_status = true
    await ownerResponse.save()
    return res.json(returnResponse)
  }
}

