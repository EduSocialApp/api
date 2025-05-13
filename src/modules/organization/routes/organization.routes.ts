import { Router } from 'express'

import { organizationMembers } from '../controllers/organizationMembers.controller'
import { organizationsList } from '../controllers/organizationsList.controller'
import { createNewOrganization } from '../controllers/createNewOrganization.controller'
import { userScopes, ensureAuthenticated, ensureUserPrivileges } from '../../user'
import { organizationsWaitingForAnalysis } from '../controllers/organizationsWatingForAnalyse.controller'
import { userOrganizations } from '../controllers/userOrganizations.controller'
import { approveUserLinkOrganization } from '../controllers/approveUserLinkOrganization.controller'
import { unlinkUserOrganization } from '../controllers/unlinkUserOrganization.controller'
import { findOrganizationById } from '../controllers/findOrganizationById.controller'
import { ensureOrgExists } from '../middlewares/ensureOrgExists.middleware'
import { totalMembersInOrganization } from '../controllers/totalMembersInOrganization.controller'
import { getOrganizationEvents } from '../controllers/getOrganizationEvents.controller'
import { userPermissionsInOrganization } from '../controllers/userPermissionsInOrganization.controller'
import { getOrganizationAddresses } from '../controllers/getOrganizationAddresses.controller'
import { getOrganizationPosts } from '../controllers/getOrganizationPosts.controller'
import { uploadMultipleFilesMiddleware, uploadSingleFileMiddleware } from '../../../middlewares/multer'
import { generateBlurhash } from '../../../middlewares/generateBlurhash'
import { createNewPost } from '../controllers/createNewPost.controller'
import { linkUserOrganization } from '../controllers/linkUserOrganization.controller'
import { ensureOrgPrivileges } from '../middlewares/ensureOrgPrivileges.middleware'
import { uploadS3Middleware } from '../../../middlewares/uploadS3'
import { updateProfilePicture } from '../controllers/updateProfilePicture.controller'
import { approveOrganization } from '../controllers/approveOrganization.controller'
import { rejectOrganization } from '../controllers/rejectOrganization.controller'

const orgRoutes = Router()

orgRoutes.get('/', organizationsList)
orgRoutes.post('/create', ensureAuthenticated, ensureUserPrivileges([userScopes.organization.create]), createNewOrganization)
orgRoutes.get('/waitingAnalysis', ensureAuthenticated, ensureUserPrivileges([], 'MODERATOR'), organizationsWaitingForAnalysis)

orgRoutes.get('/user/:id', ensureAuthenticated, userOrganizations)

orgRoutes.post('/member/:organizationMemberId/approve', ensureAuthenticated, approveUserLinkOrganization)
orgRoutes.post('/member/:organizationMemberId/unlink', ensureAuthenticated, unlinkUserOrganization)

// Post
orgRoutes.get('/:id', ensureAuthenticated, ensureOrgExists, findOrganizationById)
orgRoutes.get('/:id/totalMembers', ensureAuthenticated, ensureOrgExists, totalMembersInOrganization)
orgRoutes.get('/:id/members', ensureAuthenticated, ensureOrgExists, organizationMembers)
orgRoutes.get('/:id/role', ensureAuthenticated, ensureOrgExists, userPermissionsInOrganization)
orgRoutes.get('/:id/addresses', ensureAuthenticated, ensureOrgExists, getOrganizationAddresses)
orgRoutes.get('/:id/posts', ensureAuthenticated, ensureOrgExists, getOrganizationPosts)
orgRoutes.get('/:id/events', ensureAuthenticated, ensureOrgExists, getOrganizationEvents)
orgRoutes.post('/:id/posts', ensureAuthenticated, ensureOrgExists, uploadMultipleFilesMiddleware, generateBlurhash, createNewPost)

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
