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
    let newDish = await new DishModel(req.body).save()
    res.json(newDish) 
  },
  
  create_new_ingredient: async (req, res) => {
    let newIngredient = await new IngredientModel(req.body).save()
    res.json(newIngredient)
  },
  
  get_dish: function(req, res) {
    DishModel.findById(req.params.dishId, function(err, dish) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(dish);
      }
    });
  },
  
  get_ingredient: function(req, res) {
    IngredientModel.findById(req.params.ingredientId, function(err, ingredient) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(ingredient);
      }
    });
  },
  
  update_dish: function(req, res) {
    DishModel.findOneAndUpdate({_id: req.body.dishId}, req.body, {new: true}, function(err, dish) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(dish);
      }
    });
  },
  
  update_ingredient: function(req, res) {
    IngredientModel.findOneAndUpdate({_id: req.body.ingredientId}, req.body, {new: true}, function(err, ingredient) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(ingredient);
      }
    });
  },
  
  delete_dish: function(req, res) {
    DishModel.remove({_id: req.body.dishId}, function(err, dish) {
      if (err) {
        res.send(err);
      }
      else {
        res.json({ message: 'Dish successfully deleted' });
      }
    });
  },
  
  delete_ingredient: function(req, res) {
    IngredientModel.remove({_id: req.body.ingredientId}, function(err, ingredient) {
      if (err) {
        res.send(err);
      }
      else {
        res.json({ message: 'Ingredient successfully deleted' });
      }
    })
  }
}