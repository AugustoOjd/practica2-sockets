const { Usuario } = require('../classes/usuarios');
const { io } = require('../server');
const { crearMensaje } = require('../utils/ultils');


const usuarios = new Usuario()

io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on('entrarChat', (data, callback)=> {

        console.log(data)

        if( !data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: 'El nombre y la sala son necesarias'
            })
        }

        client.join(data.sala)

        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala)

        client.broadcast.emit('listaPersonas', usuarios.getPersonas() )

        callback(personas)
        
    })

    client.on('crearMensaje', (data)=> {

        let persona = usuarios.getPersona(client.id)

        let mensaje = crearMensaje( persona.nombre, data.mensaje)

        client.broadcast.emit( 'crearMensaje', mensaje ) 
    })

    client.on('disconnect', ()=>{
        
        let personaBorrada = usuarios.borrarPersona( client.id )
        
        client.broadcast.emit('crearMensaje', crearMensaje('Admin', `${personaBorrada.nombre} salio`))
        client.broadcast.emit('listaPersonas', usuarios.getPersonas() )
    })


    // mensajes privados
    
    client.on('mensajePrivado', (data)=> {

        let persona = usuarios.getPersona( client.id )

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje( persona.nombre, data.mensaje ))
    })
});