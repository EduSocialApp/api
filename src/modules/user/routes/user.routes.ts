import { Router } from 'express'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.middleware'
import { uploadMultipleFilesMiddleware, uploadSingleFileMiddleware } from '../../../middlewares/multer'
import { getUserLoggedFeed } from '../controllers/getUserLoggedFeed.controller'
import { createNewPost } from '../controllers/createNewPost.controller'
import { generateBlurhash } from '../../../middlewares/generateBlurhash'
import { getUserEvents } from '../controllers/getUserEvents.controller'
import { getSupervisedUsers } from '../controllers/getSupervisedUsers.controller'
import { linkSupervisorToUser } from '../controllers/linkSupervisorToUser.controller'
import { authenticateUser } from '../controllers/authenticateUser.controller'
import { renewToken } from '../controllers/renewSession.controller'
import { hasNewNotifications } from '../controllers/hasNewNotifications.controller'
import { pendingOrganizations } from '../controllers/pendingOrganizations.controller'
import { createNewUser } from '../controllers/createNewUser.controller'
import { listUsersToInvite } from '../controllers/listUsersToInvite.controller'
import { getLoggedContactList } from '../controllers/getLoggedContactList.controller'
import { ensureCanEditUserProfile } from '../middlewares/ensureCanEditUserProfile.middleware'
import { uploadS3Middleware } from '../../../middlewares/uploadS3'
import { profilePicture } from '../controllers/updateProfilePicture.controller'
import { updateProfileInformations } from '../controllers/updateProfileInfos.controller'
import { getUserById } from '../controllers/getUserById.controller'
import { ensureCanViewUserProfile } from '../middlewares/ensureCanViewUserProfile.middleware'
import { getUserPosts } from '../controllers/getUserPosts.controller'

const userRoutes = Router()

// Post
userRoutes.post('/posts', ensureAuthenticated, uploadMultipleFilesMiddleware, generateBlurhash, createNewPost)
userRoutes.get('/posts', ensureAuthenticated, getUserLoggedFeed)

// Events
userRoutes.get('/events', ensureAuthenticated, getUserEvents)

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
userRoutes.get('/contactList', ensureAuthenticated, getLoggedContactList)

userRoutes.patch('/:id/profilePicture', ensureAuthenticated, ensureCanEditUserProfile, uploadSingleFileMiddleware, uploadS3Middleware, profilePicture)
userRoutes.patch('/:id', ensureAuthenticated, ensureCanEditUserProfile, updateProfileInformations)
userRoutes.get('/:id', ensureAuthenticated, getUserById)

userRoutes.get('/:id/posts', ensureAuthenticated, ensureCanViewUserProfile, getUserPosts)

export { userRoutes }
