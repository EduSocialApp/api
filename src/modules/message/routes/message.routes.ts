import { Router } from 'express'
import { newMessage } from '../controllers/newMessage.controller'
import { ensureConversationExists, ensureConversationMember } from '../../conversation'

const messageRoutes = Router()

messageRoutes.post('/conversation/:id', ensureConversationExists, ensureConversationMember, newMessage)

export { messageRoutes }
