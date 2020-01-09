const express = require('express');
const path = require('path');

const app = express();
const router = express.Router();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views',path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req,res) => {
    res.render('index.html');
});

app.get('/chat', (req,res) => {
    res.render('chat.html');
});

let mensagens = [];

io.on('connection', socket => {
    console.log(`user id ${socket.id} conectado`);

    socket.on('login', username => {
        console.log("username é "+ username)
        usernameData = username;
    });

    socket.emit('mensagensAnteriores', mensagens);

    socket.on('envioMensagem', data => {
        console.log('envio de mensagem');
        var ObjetodeMensagem = {
            user: usernameData,
            mensagem: data.mensagem,
            time: data.time,
        }
        mensagens.push(ObjetodeMensagem);
        socket.emit('returnMensagem', ObjetodeMensagem);
        socket.broadcast.emit('mensagemRecebida', ObjetodeMensagem);
    });
});

server.listen(process.env.PORT || 4000, function(){
    console.log("server running");
});