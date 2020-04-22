import { Socket } from "socket.io";
import socketIO from 'socket.io';
import { UsuariosLista } from "../classes/usuarios-lista";
import { Usuario } from '../classes/usuario';


export const usuariosConectados = new UsuariosLista();

export const desconectar = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuariosConectados.borrarUsuario( cliente.id );
       
        // desconectarCliente(cliente);
    });
}

// esuchar mensaje
export const mensaje = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('mensaje', (payload: {de: string, cuerpo: string} ) => {
        console.log('Mensaje recibido', payload);

        io.emit('mensaje-nuevo', payload);
    })
}

//confiurar usuario
export const configurarUsuario = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('configurar-usuario', (payload: {nombre: string}, callback: Function) => {
        // console.log('Configurando Usuario', payload.nombre);
        usuariosConectados.actualizarNombre( cliente.id, payload.nombre );
        io.emit('usuarios-activos', usuariosConectados.getLista());

        callback({
            ok: true,
            mensaje: `Usuario ${ payload.nombre }, configurado`
        });
    });
}


export const conectarCliente = ( cliente: Socket, io:socketIO.Server ) => {
    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar(usuario);

    io.emit('usuarios-activos', usuariosConectados.getLista());
}

export const desconectarCliente = (cliente: Socket ) => {
    const list = usuariosConectados.borrarUsuario(cliente.id);
    // console.log('nueva lista', list);
}

// obtener usuarios
export const obtenerUsuarios = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('obtener-usuarios', (payload: {nombre: string}, callback: Function) => {
        // console.log('Configurando Usuario', payload.nombre);
        // usuariosConectados.actualizarNombre( cliente.id, payload.nombre );
        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista());
        /*
        callback({
            ok: true,
            mensaje: `Usuario ${ payload.nombre }, configurado`
        });
        */
    });
}