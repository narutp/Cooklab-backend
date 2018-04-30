'use strict';
var passwordHash = require('password-hash');

var mongoose = require('mongoose'),
  AchievementModel = mongoose.model('Achievements'),
  CommentModel = mongoose.model('Comments'),
  DishModel = mongoose.model('Dishes'),
  IngredientModel = mongoose.model('Ingredients'),
  PostModel = mongoose.model('Posts'),
  UserModel = mongoose.model('Users'),
  NotificationModel = mongoose.model('Notification')

module.exports = {
  list_all_dishes: async (req, res) => {
    let dishesResponse = await DishModel.find({})
    return res.json(dishesResponse)
  },
    
  list_all_ingredients: async (req, res) => {
    let ingredientsResponse = await IngredientModel.find({})
    return res.json(ingredientsResponse)
  },
  
  create_new_dish: async (req, res) => {
    let newDish =  new DishModel(req.body)
    if (req.body.type == 'mydish') {
      let recipe = req.body.recipe_str.map((r) => {
        return r.text
      })
      let ingredient = req.body.ingredient_str.map((i) => {
        return i.text
      })
      newDish.recipe = recipe
      newDish.ingredients = ingredient
    }
    await newDish.save()
    return res.json(newDish)
  },
  
  create_new_ingredient: async (req, res) => {
    let newIngredient = await new IngredientModel(req.body).save()
    return res.json(newIngredient)
  },
  
  get_dish: async (req, res) => {
    let dishResponse = await DishModel.findById(req.query.dishId)
    return res.json(dishResponse)
  },
  
  get_ingredient: async (req, res) => {
    let ingredientResponse = await IngredientModel.findById(req.query.ingredientId)
    return res.json(ingredientResponse)
  },
  
  update_dish: async (req, res) => {
    let dishResponse = await DishModel.findOneAndUpdate(
      {_id: req.body.dishId}, 
      req.body, 
      {new: true})
    return res.json(dishResponse)
  },
  
  update_ingredient: async (req, res) => {
    let ingredientResponse = await IngredientModel.findOneAndUpdate(
      {_id: req.body.ingredientId}, 
      req.body, 
      {new: true})
    return res.json(ingredientResponse)
  },
  
  delete_dish: async (req, res) => {
    let dishResponse = await DishModel.remove({_id: req.query.dishId})
    return res.json('Delete successful')
  },
  
  delete_ingredient: async (req, res) => {
    let ingredientResponse = await IngredientModel.remove({_id: req.query.ingredientId})
    return res.json('Delete successful')
  },

  delete_all_dish: async (req, res) => {
    let dishResponse = await DishModel.remove({})
    return res.json('Delete all dish successful')
  },

  delete_all_ingredient: async (req, res) => {
    let ingredientResponse = await IngredientModel.remove({})
    return res.json('Delete all ingredient successful')
  },

  rate_dish_by_id_user: async (req, res) => {
    let dishResponse = await DishModel.findOne({_id: req.body.dish_id})
    let index = dishResponse.rate_list.findIndex((data) => {
      return data.user_id === req.body.user_id
    })
    if (index > -1) {
      dishResponse.rate_list.splice(index, 1)
    }
    let rating = {
      rate: req.body.rate,
      user_id: req.body.user_id,
    }
    dishResponse.rate_list.push(rating)
    let totalRate = 0
    dishResponse.rate_list.forEach((rate) => {
      totalRate += rate.rate
    })
    let newRate = totalRate/dishResponse.rate_list.length
    if (newRate >= 4.75) {
      dishResponse.rate = 5
    } else if (newRate >= 4.25) {
      dishResponse.rate = 4.5
    } else if (newRate >= 3.75) {
        dishResponse.rate = 4
    } else if (newRate >= 3.25) {
      dishResponse.rate = 3.5
    } else if (newRate >= 2.75) {
      dishResponse.rate = 3
    } else if (newRate >= 2.25) {
      dishResponse.rate = 2.5
    } else if (newRate >= 1.75) {
      dishResponse.rate = 2
    } else if (newRate >= 1.25) {
      dishResponse.rate = 1.5
    } else if (newRate >= 0.75) {
      dishResponse.rate = 1
    } else if (newRate >= 0.25) {
      dishResponse.rate = 0.5
    } else {
      dishResponse.rate = 0
    }
    await dishResponse.save()
    return res.json(dishResponse)
  },

  get_user_dish: async (req, res) => {
    let dishResponse = await DishModel.find(
      {id_user: req.query.user_id, 
        type: { $ne: 'normal' }})
    return res.json(dishResponse)
  }
}