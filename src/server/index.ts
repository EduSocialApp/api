import express, { NextFunction, Response, Request } from 'express'

import routes from '../routes'
import { AppError } from '../functions/AppError'
import { getLocalIp } from '../functions/getLocalIp'
import { createServer } from 'http'
import { socketInit } from './socket'

interface Server {
    serverPort: number
}

function startServer({ serverPort }: Server) {
    const app = express() // Cria o servidor
    const httpServer = createServer(app)

    app.use(express.json()) // Permite receber JSON no body

    // Inicia socket e o deixa acessivel nas rotas
    socketInit(httpServer)

    app.use(routes) // Escuta rotas

    // Middleware para tratar erros
    app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof AppError) {
            res.status(err.statusCode).json(err.toJSON())
            return
        }

        console.error(err)
        res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
        })
        return
    })

    // Iniciar servidor
    const server = httpServer.listen(serverPort, () => {
        console.log(`EDUSOCIAL-API STARTED 🟢\nPORT: ${serverPort}\nIP: ${getLocalIp()}`)
    })

    return { httpServer, server }
}

export { startServer }
