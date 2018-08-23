var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var _ = require('underscore');
app.use('/', express.static(__dirname + '/public'));
server.listen(80);

//socket部分
var tid=0;
var chat=[];
io.on('connection', function(socket) {
    tid ++;
    socket.emit('number',{number:tid});
    //断开事件
    socket.on('add', function(data) {
        socket.broadcast.emit('c_add',data+'加入了聊天');
    });
    socket.on('leave', function(data) {
        //socket.broadcast用于向整个网络广播(除自己之外)
        socket.broadcast.emit('c_leave',data+'离开了聊天');
    });
    socket.on('sayTo',function (data) {
        chat.push(data);
        console.log(chat);
        socket.emit('message',{msg:chat})
    });
    setInterval(function(){
        socket.emit('message',{msg:chat})
    },1000);
    socket.on('disconnect', function(){
        console.log('connection is disconnect!');
        tid--;
        console.log(socket.id);
    });
});
setInterval(function(){
    chat=[];
},3600000);