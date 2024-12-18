import { Router } from 'express'

import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import approveOrganization from './http/approveOrganization'
import createNewOrganization from './http/createNewOrganization'
import linkUserOrganization from './http/linkUserOrganization'
import unlinkUserOrganization from './http/unlinkUserOrganization'
import rejectOrganization from './http/rejectOrganization'
import { ensureUserPrivileges } from '@/middlewares/privileges/ensureUserPrivileges'
import { userScopes } from '../user/user.scopes'
import organizationsWaitingForAnalysis from './http/organizationsWatingForAnalyse'
import organizationsList from './http/organizationsList'
import totalMembersInOrganization from './http/totalMembersInOrganization'
import { ensureOrgExists } from '@/middlewares/ensureOrgExists'
import findOrganizationById from './http/findOrganizationById'
import updateProfilePicture from './http/updateProfilePicture'
import { ensureOrgPrivileges } from '@/middlewares/ensureOrgPrivileges'
import { uploadMultipleFilesMiddleware, uploadSingleFileMiddleware } from '@/middlewares/multer'
import { uploadS3Middleware } from '@/middlewares/uploadS3'
import organizationMembers from './http/organizationMembers'
import userPermissionsInOrganization from './http/userPermissionsInOrganization'
import approveUserLinkOrganization from './http/approveUserLinkOrganization'
import userOrganizations from './http/userOrganizations'
import getOrganizationPosts from './http/posts/getOrganizationPosts'
import { generateBlurhash } from '@/middlewares/generateBlurhash'
import createNewPost from './http/posts/createNewPost'

const orgRoutes = Router()

orgRoutes.get('/', organizationsList)
orgRoutes.post('/create', ensureAuthenticated, ensureUserPrivileges([userScopes.organization.create]), createNewOrganization)
orgRoutes.get('/waitingAnalysis', ensureAuthenticated, ensureUserPrivileges([], 'MODERATOR'), organizationsWaitingForAnalysis)

orgRoutes.get('/user/:id', ensureAuthenticated, userOrganizations)

orgRoutes.post('/member/:organizationMemberId/approve', ensureAuthenticated, approveUserLinkOrganization)
orgRoutes.post('/member/:organizationMemberId/unlink', ensureAuthenticated, unlinkUserOrganization)

// Post
orgRoutes.post('/:organizationId/posts', ensureAuthenticated, uploadMultipleFilesMiddleware, generateBlurhash, createNewPost)
orgRoutes.get('/:organizationId/posts', ensureAuthenticated, getOrganizationPosts)

orgRoutes.get('/:id', ensureAuthenticated, ensureOrgExists, findOrganizationById)
orgRoutes.get('/:id/totalMembers', ensureAuthenticated, ensureOrgExists, totalMembersInOrganization)
orgRoutes.get('/:id/members', ensureAuthenticated, ensureOrgExists, organizationMembers)
orgRoutes.get('/:id/role', ensureAuthenticated, ensureOrgExists, userPermissionsInOrganization)

orgRoutes.post('/:id/link', ensureAuthenticated, ensureOrgExists, linkUserOrganization)

orgRoutes.patch(
    '/:id/profilePicture',
    ensureAuthenticated,
    ensureOrgExists,
    ensureOrgPrivileges('MODERATOR'),
    uploadSingleFileMiddleware,
    uploadS3Middleware,
    updateProfilePicture
)

orgRoutes.post('/:id/approve', ensureAuthenticated, ensureOrgExists, ensureUserPrivileges([], 'MODERATOR'), approveOrganization)
orgRoutes.post('/:id/reject', ensureAuthenticated, ensureOrgExists, ensureUserPrivileges([], 'MODERATOR'), rejectOrganization)

export { orgRoutes }
