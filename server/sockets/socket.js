const { Usuario } = require('../classes/usuarios');
const { io } = require('../server');


const usuarios = new Usuario()

io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on('entrarChat', (usuario, callback)=> {

        if( !usuario.nombre){
            return callback({
                error: true,
                mensaje: 'El nombre es necesario'
            })
        }

        let personas = usuarios.agregarPersona(client.id, usuario.nombre)

        client.broadcast.emit('listaPersonas', usuarios.getPersonas() )

        callback(personas)
        
    })

    client.on('disconnect', ()=>{
        
        let personaBorrada = usuarios.borrarPersona( client.id )
        
        client.broadcast.emit('crearMensaje', { usuario: 'Administrador', mensaje: `${personaBorrada.nombre} abandono el chat`})
        client.broadcast.emit('listaPersonas', usuarios.getPersonas() )
    })
});