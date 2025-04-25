import { Router } from 'express'

import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated'
import createUserLinkShareable from './http/createUserLinkShareable'

const shareLinkRoutes = Router()

shareLinkRoutes.post('/user', ensureAuthenticated, createUserLinkShareable)

export { shareLinkRoutes }
