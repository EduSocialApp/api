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

    const server = app.listen(serverPort, () => {
        console.log(`Server started on ${serverPort} 🟢`)
    })

    return { app, server }
}

export { startServer }
