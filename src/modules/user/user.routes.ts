import { Router } from 'express'

import renewToken from '../session/http/renewSession'

import authenticateUser from './http/authenticateUser'
import createNewUser from './http/createNewUser'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import getUserById from './http/getUserById'
import { uploadSingleFileMiddleware } from '@/middlewares/multer'
import profilePicture from './http/profilePicture'
import { uploadS3Middleware } from '@/middlewares/uploadS3'
import listUsersToInvite from './http/listUsersToInvite'
import hasNewNotifications from './http/hasNewNotifications'
import pendingOrganizations from './http/pendingOrganizations'

const userRoutes = Router()

// Basicas
userRoutes.get('/pendingOrganizations', ensureAuthenticated, pendingOrganizations)
userRoutes.get('/totalNotifications', ensureAuthenticated, hasNewNotifications)
userRoutes.post('/register', createNewUser)
userRoutes.get('/toInvite', ensureAuthenticated, listUsersToInvite)
userRoutes.get('/:id', ensureAuthenticated, getUserById)

// Pessoal
userRoutes.post('/login', authenticateUser)
userRoutes.patch('/login', renewToken)
userRoutes.patch('/profilePicture', ensureAuthenticated, uploadSingleFileMiddleware, uploadS3Middleware, profilePicture)

export { userRoutes }
