import { Router } from 'express'

import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated'

import approveOrganization from './http/approveOrganization'
import createNewOrganization from './http/createNewOrganization'
import linkUserOrganization from './http/linkUserOrganization'
import unlinkUserOrganization from './http/unlinkUserOrganization'
import rejectOrganization from './http/rejectOrganization'
import { ensureUserPrivileges } from '@/middlewares/ensureUserPrivileges'
import { userScopes } from '../user/user.scopes'
import organizationsWaitingForAnalysis from './http/organizationsWatingForAnalyse'
import organizationsList from './http/organizationsList'
import myOrganizations from './http/myOrganizations'

const orgRoutes = Router()

orgRoutes.post('/create', ensureAuthenticated, ensureUserPrivileges([userScopes.organization.create]), createNewOrganization)
orgRoutes.get('/', organizationsList)
orgRoutes.get('/my', ensureAuthenticated, myOrganizations)

orgRoutes.post('/:id/link', ensureAuthenticated, linkUserOrganization)
orgRoutes.post('/:id/unlink', ensureAuthenticated, unlinkUserOrganization)

orgRoutes.post('/:id/approve', ensureAuthenticated, ensureUserPrivileges([], 'MODERATOR'), approveOrganization)
orgRoutes.post('/:id/reject', ensureAuthenticated, ensureUserPrivileges([], 'MODERATOR'), rejectOrganization)
orgRoutes.get('/waitingAnalysis', ensureAuthenticated, ensureUserPrivileges([], 'MODERATOR'), organizationsWaitingForAnalysis)

export { orgRoutes }
