import { Router } from 'express'
import { ensureAuthenticated } from '../../user/middlewares/ensureAuthenticated.middleware'
import { createUserLinkShareable } from '../controller/createUserLinkShareable.controller'

const shareLinkRoutes = Router()

shareLinkRoutes.post('/user', ensureAuthenticated, createUserLinkShareable)

export { shareLinkRoutes }
