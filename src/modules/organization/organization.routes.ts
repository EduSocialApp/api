import { Router } from 'express'

import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated'

import approveOrganization from './http/approveOrganization'
import createNewOrganization from './http/createNewOrganization'
import linkUserOrganization from './http/linkUserOrganization'
import unlinkUserOrganization from './http/unlinkUserOrganization'

const orgRoutes = Router()

orgRoutes.post('/create', ensureAuthenticated, createNewOrganization)

orgRoutes.post('/link', ensureAuthenticated, linkUserOrganization)
orgRoutes.post('/unlink', ensureAuthenticated, unlinkUserOrganization)

orgRoutes.post('/approve', ensureAuthenticated, approveOrganization)

export { orgRoutes }
