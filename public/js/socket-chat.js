var socket = io();


var params = new URLSearchParams(window.location.search)

if( !params.has('nombre') || !params.has('sala') ){

    window.location = 'index.html'
    throw new Error('El nombre y sala son necesarios')
}

var usuario = {
    nombre: params.get('nombre'),
    sala:   params.get('sala')
}

socket.on('connect', () => {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, (resp)=> {

        console.log('Usuarios conectados', resp)
    })
});

// escuchar
socket.on('disconnect', () => {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('enviarMensaje', {
//     usuario: 'Augusto',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', (mensaje) => {

    console.log('Servidor:', mensaje);

});

// Esuchar cambios de estados en el chat

socket.on('listaPersonas', (personas)=> {
    console.log(personas)
})


// mensajes privados

socket.on('mensajePrivado', (mensaje)=> {


    console.log('mensaje privado', mensaje)
})