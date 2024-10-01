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
import totalMembersInOrganization from './http/totalMembersInOrganization'
import { ensureOrgExists } from '@/middlewares/ensureOrgExists'
import findOrganizationById from './http/findOrganizationById'
import updateProfilePicture from './http/updateProfilePicture'
import { ensureOrgPrivileges } from '@/middlewares/ensureOrgPrivileges'
import { uploadSingleFileMiddleware } from '@/middlewares/multer'
import { uploadS3Middleware } from '@/middlewares/uploadS3'

const orgRoutes = Router()

// Basicas
orgRoutes.get('/', organizationsList)
orgRoutes.get('/:id', ensureOrgExists, findOrganizationById)
orgRoutes.get('/my', ensureAuthenticated, myOrganizations)
orgRoutes.get('/:id/totalMembers', ensureOrgExists, totalMembersInOrganization)
orgRoutes.post('/create', ensureAuthenticated, ensureUserPrivileges([userScopes.organization.create]), createNewOrganization)

// Gerenciamento
orgRoutes.post('/:id/link', ensureAuthenticated, ensureOrgExists, linkUserOrganization)
orgRoutes.post('/:id/unlink', ensureAuthenticated, ensureOrgExists, unlinkUserOrganization)
orgRoutes.patch(
    '/:id/profilePicture',
    ensureAuthenticated,
    ensureOrgExists,
    ensureOrgPrivileges('MODERATOR'),
    uploadSingleFileMiddleware,
    uploadS3Middleware,
    updateProfilePicture
)

// Administrativas
orgRoutes.get('/waitingAnalysis', ensureAuthenticated, ensureUserPrivileges([], 'MODERATOR'), organizationsWaitingForAnalysis)
orgRoutes.post('/:id/approve', ensureAuthenticated, ensureOrgExists, ensureUserPrivileges([], 'MODERATOR'), approveOrganization)
orgRoutes.post('/:id/reject', ensureAuthenticated, ensureOrgExists, ensureUserPrivileges([], 'MODERATOR'), rejectOrganization)

export { orgRoutes }
