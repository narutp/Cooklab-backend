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
      newDish.recipe = req.body.recipe_str.split("\n")
      newDish.ingredients = req.body.ingredients_str.split("\n")
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
    let dishResponse = await DishModel.findOneAndUpdate({_id: req.body.dishId}, req.body, {new: true})
    return res.json(dishResponse)
  },
  
  update_ingredient: async (req, res) => {
    let ingredientResponse = await IngredientModel.findOneAndUpdate({_id: req.body.ingredientId}, req.body, {new: true})
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
  }
}