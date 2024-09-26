import express, { NextFunction, Response, Request } from 'express'

import routes from '../routes'
import { AppError } from '../functions/AppError'

interface IServer {
    serverPort: number
}

function startServer({ serverPort }: IServer) {
    const app = express()

    app.use(express.json())

    app.use(routes)

    app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
        if (err instanceof AppError) {
            return response.status(err.statusCode).json({
                message: err.message,
            })
        }

        return response.status(500).json({
            status: 'error',
            message: `Internal server error - ${err.message}`,
        })
    })

    const server = app.listen(serverPort, () => {
        console.log(`Server started on ${serverPort} 🟢`)
    })

    return { app, server }
}

export { startServer }
