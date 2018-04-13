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

  list_all_comments: async (req, res) => {
    let commentResponse = await CommentModel.find({})
    res.json(commentResponse)
  },
  
  list_all_posts: async (req, res) => {
    let postResponse = await PostModel.find({})
    res.json(postResponse)
  },
  
  create_new_comment: async (req, res) => {
    if (req.body.text == "") {
      res.json(false)
    }
    let newComment = new CommentModel(req.body)
    await newComment.save()
    let postResponse = await PostModel.findOne({_id: newComment.id_post})
    postResponse.comments.push(newComment._id)
    await postResponse.save()
    res.json(newComment)
  },
  
  create_new_post: async (req, res) => {
    let newPost = await new PostModel(req.body).save()
    let dishResponse = await DishModel.findById(newPost.id_dish)
    if (dishResponse.type == 'mydish') {
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
      await userResponse.save()
      // let userRank = userResponse.rank
      let userExp = userResponse.exp
      if (userExp >= 10000)
        userResponse.rank = '10'
      else if (userExp >= 5000)
        userResponse.rank = '9'
      else if (userExp >= 2500)
        userResponse.rank = '8'
      else if (userExp >= 1000)
        userResponse.rank = '7'
      else if (userExp >= 500)
        userResponse.rank = '6'
      else if (userExp >= 300)
        userResponse.rank = '5'
      else if (userExp >= 150)
        userResponse.rank = '4'
      else if (userExp >= 80)
        userResponse.rank = '3'
      else if (userExp >= 40)
        userResponse.rank = '2'
      else
        userResponse.rank = '1'
      await userResponse.save()
    }
    res.json(newPost)
  },
  
  get_comment: async (req, res) => {
    let commentResponse = await CommentModel.findById(req.params.commentId)
    res.json(commentResponse)
  },
  
  get_post_by_post_id: async (req, res) => {
    let postResponse = await PostModel.findById(req.params.postId)
    res.json(postResponse)
  },
  
  get_images_posts_by_user_id: async (req, res) => {
    let postResponse = await PostModel.find({'id_user': req.params.userId},'id_dish')
    let idDishFromPost = postResponse.map((post) => {
      return post.id_dish
    })
    let distResponse = await DishModel.find({_id: {$in: id_dish_arr}},'image')
    let imageFromDish = distResponse.map((dish) => {
      return dish.image
    })
    res.json(imageFromDish)
  },
  
  update_comment: async (req, res) => {
    let commentResponse = await CommentModel.findOneAndUpdate({_id: req.body.commentId}, req.body, {new: true})
    res.json(commentResponse)
  },
  
  update_post: async (req, res) => {
    let postResponse = await PostModel.findOneAndUpdate({_id: req.body.postId}, req.body, {new: true})
    res.json(postResponse)
  },
  
  delete_comment: async (req, res) => {
    let commentResponse = await CommentModel.findOne({_id: req.body.commentId})
    let postId = comment.id_post
    commentResponse = await CommentModel.remove({_id: req.body.commentId})
    let postResponse = await PostModel.findOne({_id: postId})
    let index = postResponse.comments.indexOf(req.body.commentId)
    if (index > -1) {
      postResponse.comments.splice(index, 1)
    }
    await postResponse.save()
    res.json({ message: 'Comment successfully deleted' })
  },
  
  delete_post: async (req, res) => {
    let postResponse = await PostModel.findOne({_id: req.body.postId},'comments')
    let commentFromPost = postResponse.comments
    postResponse = await PostModel.remove({_id: req.body.postId})    
    let commentResponse = await CommentModel.remove({_id: {$in: commentFromPost}})
    res.json({ message: 'Post and comment successfully deleted' })
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
    let idUserFromCommentResponse, userNameFromCommentResponse = []
    for(let i = 0; i< postResponse.length; i++) {
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
      
      // let userNameFromCommentResponse = await UserModel.find({_id: {$in: idUserFromComment}}, 'name') 
      //หา name ของ userFromComment แบบข้างบน
      let name = user.name
      let status = (postResponse[i].trophy_list.indexOf(req.query.userId) > -1)
      let commentArr = [], comment
      for (let j = 0; j< userNameFromCommentResponse.length; j++) {
        let text = commentResponse[j].text
        comment = {
          id_user: userNameFromCommentResponse[j]._id,
          name: userNameFromCommentResponse[j].name,
          text: text
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
        status: status
      }
      returnResponse.push(postDetail)
    }
    returnResponse.sort(Compare.compare)
    res.json(returnResponse)
  },
  
  get_top_feed: async (req, res) => {
    let postResponse = await PostModel.find({}).sort({'loves':-1}).limit(5).exec()
    res.json(postResponse)
  },
  
  increase_trophy: async (req, res) => {
    let postResponse = await PostModel.findOne({_id: req.body.postId})
    if (postResponse.trophy_list.indexOf(req.body.userId) > -1)
      res.json(post)
    postResponse.trophies++
    postResponse.trophy_list.push(req.body.userId)
    await postResponse.save()
    res.json(postResponse)
  },
  
  decrease_trophy: async (req, res) => {
    let postResponse = await PostModel.findOne({_id: req.body.postId})
    if (postResponse.trophy_list.indexOf(req.body.userId) <= -1)
      res.json(postResponse)
      postResponse.trophies--
    let index = postResponse.trophy_list.indexOf(req.body.userId)
    postResponse.trophy_list.splice(index, 1)
    await postResponse.save()
    res.json(postResponse)
  },

  delete_all_post: async (req, res) => {
    let postResponse = await PostModel.remove({})
    res.end('success');
  }
}

