var socket = require('socket.io')

const onlineUser = []

var io = null

function notify(user_id) {
	var user = onlineUser.find(id => id.user_id === user_id)
	if (user !== undefined) {
		console.log('notify user ', user)
		io.to(user.id).emit('notify', (new Date()))
	}
}

module.exports = {
  initSocket: (server) => {
  io = socket(server);

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
  },
  notify
}


