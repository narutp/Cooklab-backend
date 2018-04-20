var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Achievement = require('./api/models/achievementModel'),
  Comment = require('./api/models/commentModel'),
  Dish = require('./api/models/dishModel'),
  Ingredient = require('./api/models/ingredientModel'),
  Post = require('./api/models/postModel'),
  User = require('./api/models/userModel'),
  bodyParser = require('body-parser'),
  _ = require('lodash')
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://cooklab.online:27017/cooklabdb'); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(mongoose)
// app.use(_)

var routes = require('./api/routes/cooklabRoutes'); //importing route
routes(app); //register the route


app.listen(port);


console.log('CookLab RESTful API server started on: ' + port);