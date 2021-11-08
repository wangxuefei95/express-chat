window.onload = function() {
  const socket = io()
  socket.on('connect', () => {
    console.log('建立连接')

    let name
    while(!name || !name.trim()) {
      name = prompt('你的昵称是？')
    }
    // 输入昵称，加入聊天室
    socket.emit('join', name)
    // 显示聊天窗口
    document.getElementById('chat').style.display = 'block'
  })

  // 发送消息
  const input = document.getElementById('input')
  document.getElementById('form').onsubmit = function() {
    addMessage('我', input.value)
    socket.emit('text', input.value)
    
    // 重置输入框
    input.value = ''
    input.focus()
    
    return false
  }

  // 接收消息
  socket.on('text', addMessage)

  // 接收广播
  socket.on('announcement', function(msg) {
    const li = document.createElement('li')
    li.className = 'announcement'
    li.innerHTML = msg
    document.getElementById('messages').appendChild(li)
  })

  // 消息显示
  function addMessage(user, text) {
    const li = document.createElement('li')
    li.className = 'message'
    li.innerHTML = `<b>${user}</b>: ${text}`
    document.getElementById('messages').appendChild(li)
  }
}