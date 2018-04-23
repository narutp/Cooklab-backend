var express = require('express'),
  socket = require('socket.io'),
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
  _ = require('lodash')
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://35.197.132.120:27017/cooklabdb'); 
mongoose.connect('mongodb://api.cooklab.online/cooklabdb');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/cooklabRoutes'); //importing route
routes(app); //register the route

var server = require('http').Server(app);
var io = socket(server);

const onlineUser = []
io.on('connection', (socket) => {
	console.log('user connected ', socket.id)
	socket.on('disconnect', () => {
		const user = onlineUser.find(i => i.id === socket.id)
		console.log(user)
		onlineUser.pop(user)
		console.log('user disconnected')
		console.log(onlineUser)
	})
	socket.on('authenUser', (data) => {
		const user = { id: socket.id, user_id: data.userId }
		onlineUser.push(user)
		console.log('authenUser', socket.id)
		console.log(onlineUser)
	})
	socket.on('notify', (data) => {
		var user = onlineUser.find(id => id.user_id === data.targetId)
		if (user !== undefined) {
			console.log('notify user ', user)
			socket.to(user.id).emit('notify', (new Date()))
		}
	})
})

server.listen(port, () => {
	console.log('LookGoods RESTful API server started on: ' + port, new Date())
})

module.exports = io

