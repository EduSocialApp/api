import { Router } from 'express'
import { startConversation } from './http/startConversation'
import { getConversation } from './http/getConversation'

const conversationRoutes = Router()

conversationRoutes.post('/', startConversation)
conversationRoutes.get('/:conversationId', getConversation)

export { conversationRoutes }
