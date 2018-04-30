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
	Notification = require('./api/models/notificationModel'),
  bodyParser = require('body-parser'),
	_ = require('lodash'),
	socket = require('./socket')
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://35.197.132.120:27017/cooklabdb'); 
// mongoose.connect('mongodb://api.cooklab.online/cooklabdb');
mongoose.connect('mongodb://localhost:27017/cooklabdb');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/cooklabRoutes'); //importing route
routes(app); //register the route

var server = require('http').Server(app);

socket.initSocket(server)

server.listen(port, () => {
	console.log('Cooklab RESTful API server started on: ' + port, new Date())
})

