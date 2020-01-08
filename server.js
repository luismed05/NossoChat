const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views',path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req,res) => {
    res.render('index.html');
});

let mensagens = [];

io.on('connection', socket => {
    console.log(`user id ${socket.id} conectado`);

    socket.emit('mensagensAnteriores', mensagens);

    socket.on('envioMensagem', data => {
        mensagens.push(data);
        socket.broadcast.emit('mensagemRecebida', data);
    });
});

http.listen(process.env.PORT || 4000, function(){
    console.log("server running");
});