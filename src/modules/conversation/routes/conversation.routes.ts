import { Router } from 'express'
import startConversation from '../controllers/startConversation.controller'
import getConversation from '../controllers/getConversation.controller'

const conversationRoutes = Router()

conversationRoutes.post('/', startConversation)
conversationRoutes.get('/:conversationId', getConversation)

export { conversationRoutes }
