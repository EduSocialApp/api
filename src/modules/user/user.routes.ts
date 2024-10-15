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

const userRoutes = Router()

// Autenticacao
userRoutes.post('/login', authenticateUser)
userRoutes.patch('/login', renewToken)

// Notificacoes
userRoutes.get('/totalNotifications', ensureAuthenticated, hasNewNotifications)

// Basicas
userRoutes.get('/pendingOrganizations', ensureAuthenticated, pendingOrganizations)
userRoutes.post('/register', createNewUser)
userRoutes.get('/toInvite', ensureAuthenticated, listUsersToInvite)
userRoutes.get('/:id', ensureAuthenticated, getUserById)
userRoutes.patch('/profilePicture', ensureAuthenticated, uploadSingleFileMiddleware, uploadS3Middleware, profilePicture)

// Supervisor
userRoutes.post('/linkSupervisorToUser', ensureAuthenticated, linkSupervisorToUser)

export { userRoutes }
