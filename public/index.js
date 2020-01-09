window.onload = () => {
    var socket = io('');
    var count = localStorage.getItem('count');
    var usernameCheck = localStorage.getItem('username');
    console.log(count);
    if(!count){
        count = 0;
    }
    if(!usernameCheck && count < 1){
        count ++;
        localStorage.setItem('count',count);
        window.location.assign('/');
    }

    function login(username) {
        socket.emit('login', username);
        localStorage.setItem('username',username);
    }

    $('#loginPage').submit(function(event){
        var username = $('input[name=user]').val();
        if(username.length){
            window.location.assign('/chat');
            login(username);
        }
    });

    function renderMessage(message) {
        console.log('render message' + message.mensagem);
        $('.messages').append(`
            <div class="message">
                <div>
                    <strong>${message.user}</strong> disse: <small>${message.mensagem}</small>
                </div>
                <div>
                    <small class="text-muted">${message.time}</small>
                </div>
            </div>
            `)
    }

    socket.on('mensagensAnteriores', function (mensagens) {
        for (mensagem of mensagens) {
            renderMessage(mensagem);
        }
    });

    socket.on('mensagemRecebida', function (mensagem) {
        //renderMessage(mensagem);
    })

    $('#chat').submit(function (event) {
        event.preventDefault();

        //var autor = $('input[name=username]').val();
        var mensagem = $('input[name=message]').val();
        var tempo = new Date();
        tempo = tempo.toLocaleTimeString();

        if (mensagem.length) {
            var dataMensagem = {
                mensagem: mensagem,
                time: tempo,
            };

            socket.emit('envioMensagem', dataMensagem);

            socket.on('returnMensagem', function (ObjetodeMensagem) {
                renderMessage(ObjetodeMensagem);
            });

            $('input[name=message]').val('');
        }
    });
}