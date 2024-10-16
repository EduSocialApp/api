import { Router } from 'express'

import renewToken from './http/authentication/renewSession'
import authenticateUser from './http/authentication/authenticateUser'
import createNewUser from './http/users/createNewUser'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import getUserById from './http/users/getUserById'
import { uploadSingleFileMiddleware } from '@/middlewares/multer'
import profilePicture from './http/users/updateProfilePicture'
import { uploadS3Middleware } from '@/middlewares/uploadS3'
import listUsersToInvite from './http/users/listUsersToInvite'
import hasNewNotifications from './http/notifications/hasNewNotifications'
import pendingOrganizations from './http/users/pendingOrganizations'
import linkSupervisorToUser from './http/supervisor/linkSupervisorToUser'
import getSupervisedUsers from './http/supervisor/getSupervisedUsers'
import { ensureUserPrivileges } from '@/middlewares/ensureUserPrivileges'
import updateProfileInformations from './http/users/updateProfileInfos'

const userRoutes = Router()

// Supervisor
userRoutes.get('/supervisedUsers', ensureAuthenticated, getSupervisedUsers)
userRoutes.post('/linkSupervisorToUser', ensureAuthenticated, linkSupervisorToUser)

// Autenticacao
userRoutes.post('/login', authenticateUser)
userRoutes.patch('/login', renewToken)

// Notificacoes
userRoutes.get('/totalNotifications', ensureAuthenticated, hasNewNotifications)

// Basicas
userRoutes.get('/pendingOrganizations', ensureAuthenticated, pendingOrganizations)
userRoutes.post('/register', createNewUser)
userRoutes.get('/toInvite', ensureAuthenticated, listUsersToInvite)

userRoutes.patch(
    '/:id/profilePicture',
    ensureAuthenticated,
    ensureUserPrivileges([], 'MODERATOR_OR_LOGGED'),
    uploadSingleFileMiddleware,
    uploadS3Middleware,
    profilePicture
)
userRoutes.patch('/:id', ensureAuthenticated, ensureUserPrivileges([], 'MODERATOR_OR_LOGGED'), updateProfileInformations)
userRoutes.get('/:id', ensureAuthenticated, getUserById)

export { userRoutes }
