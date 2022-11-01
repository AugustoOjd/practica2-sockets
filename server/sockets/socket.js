const { Usuario } = require('../classes/usuarios');
const { io } = require('../server');
const { crearMensaje } = require('../utils/ultils');


const usuarios = new Usuario()

io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on('entrarChat', (data, callback)=> {

        if( !data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: 'El nombre y la sala son necesarias'
            })
        }

        client.join(data.sala)

        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala)

        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala) )

        callback(usuarios.getPersonasPorSala( data.sala ))
        
    })

    client.on('crearMensaje', (data)=> {

        let persona = usuarios.getPersona(client.id)

        let mensaje = crearMensaje( persona.nombre, data.mensaje)

        client.broadcast.to(persona.data).emit( 'crearMensaje', mensaje ) 
    })

    client.on('disconnect', ()=>{
        
        let personaBorrada = usuarios.borrarPersona( client.id )
        
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Admin', `${personaBorrada.nombre} salio`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala) )
    })


    // mensajes privados
    
    client.on('mensajePrivado', (data)=> {

        let persona = usuarios.getPersona( client.id )

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje( persona.nombre, data.mensaje ))
    })
});