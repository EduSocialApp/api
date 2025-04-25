import { config as configDotEnv } from 'dotenv'
import { startServer } from './server'

configDotEnv()

startServer({
    serverPort: Number(process.env.EDUSOCIAL_PORT_BACKEND) || 3000,
})
