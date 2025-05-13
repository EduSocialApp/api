import { Router } from 'express'
import { startConversation } from '../controllers/startConversation.controller'
import { getConversation } from '../controllers/getConversation.controller'
import { getUserConversations } from '../controllers/getUserConversations.controller'

const conversationRoutes = Router()

conversationRoutes.post('/', startConversation)
conversationRoutes.get('/', getUserConversations)
conversationRoutes.get('/:conversationId', getConversation)

export { conversationRoutes }
