import { Server as IServer } from 'http'
import { Server } from 'socket.io'
import { socketConnections } from './socketConnections'
import { validateAccessToken } from '../../modules/user'

let io: Server

export function socketInit(httpServer: IServer) {
    io = new Server(httpServer, {
        cors: {
            origin: '*',
        },
    })

    io.use(async (socket, next) => {
        const token = socket.handshake.auth?.token

        try {
            const user = await validateAccessToken(token)
            socket.data.userId = user.id
            socket.data.role = user.role

            return next()
        } catch {
            return next(new Error('Invalid token'))
        }
    })

    io.on('connection', (socket) => {
        console.log(`[SOCKET] userId "${socket.data.userId}" connected on socket with id "${socket.id}"`)
        socketConnections.set(socket.data.userId, socket.id)

        // Quando o cliente se desconecta, ele remove o id do app
        socket.on('disconnect', () => {
            for (const [userId, socketId] of socketConnections.entries()) {
                if (socketId === socket.id) {
                    socketConnections.delete(userId)
                    break
                }
            }
        })
    })

    return io
}

export function getSocket(): Server {
    return io
}
