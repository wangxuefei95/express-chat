const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public', { extensions: ['htm', 'html'] }))

const httpServer = http.createServer(app)
const io = new socketIo.Server(httpServer, {/* options */})

// io.on('connection', (socket) => {
//   console.log('socket已连接')
//   socket.on('join', (name) => {
//     console.log('event:[join]', name)
//     socket.nickname = name
//     socket.emit('announcement', name + 'joined the chat.')
//   })

//   socket.on('text', function(msg) {
//     socket.emit('text', socket.nickname, msg)
//   })
// })
// 将上面的方式替换为这种 将不会发送消息给自己
io.sockets.on('connection', function(socket) {
  socket.on('join', function(name) {
    socket.nickname = name
    socket.broadcast.emit('announcement', name + ' 加入了聊天室')
  })

  socket.on('text', function(msg) {
    socket.broadcast.emit('text', socket.nickname, msg)
  })
})


const server = httpServer.listen(3000, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log(server.address().host, server.address().port)
  }
})