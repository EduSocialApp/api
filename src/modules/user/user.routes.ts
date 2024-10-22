import { Router } from 'express'

import renewToken from './http/authentication/renewSession'
import authenticateUser from './http/authentication/authenticateUser'
import createNewUser from './http/users/createNewUser'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import getUserById from './http/users/getUserById'
import { uploadMultipleFilesMiddleware, uploadSingleFileMiddleware } from '@/middlewares/multer'
import profilePicture from './http/users/updateProfilePicture'
import { uploadS3Middleware } from '@/middlewares/uploadS3'
import listUsersToInvite from './http/users/listUsersToInvite'
import hasNewNotifications from './http/notifications/hasNewNotifications'
import pendingOrganizations from './http/users/pendingOrganizations'
import linkSupervisorToUser from './http/supervisor/linkSupervisorToUser'
import getSupervisedUsers from './http/supervisor/getSupervisedUsers'
import updateProfileInformations from './http/users/updateProfileInfos'
import createNewPost from './http/posts/createNewPost'
import getUserLoggedFeed from './http/posts/getUserLoggedFeed'
import { generateBlurhash } from '@/middlewares/generateBlurhash'
import getUserPosts from './http/posts/getUserPosts'
import { ensureCanViewUserProfile } from '@/middlewares/privileges/ensureCanViewUserProfile'
import { ensureCanEditUserProfile } from '@/middlewares/privileges/ensureCanEditUserProfile'

const userRoutes = Router()

// Post
userRoutes.post('/posts', ensureAuthenticated, uploadMultipleFilesMiddleware, generateBlurhash, createNewPost)
userRoutes.get('/posts', ensureAuthenticated, getUserLoggedFeed)

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

userRoutes.patch('/:id/profilePicture', ensureAuthenticated, ensureCanEditUserProfile, uploadSingleFileMiddleware, uploadS3Middleware, profilePicture)
userRoutes.patch('/:id', ensureAuthenticated, ensureCanEditUserProfile, updateProfileInformations)
userRoutes.get('/:id', ensureAuthenticated, getUserById)

userRoutes.get('/:id/posts', ensureAuthenticated, ensureCanViewUserProfile, getUserPosts)

export { userRoutes }
