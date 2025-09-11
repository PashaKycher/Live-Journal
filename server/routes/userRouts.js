import express from 'express';
import {
    findUserController, getUserController, followUserController,
    unfollowUserController, deleteUserController, updateUserController,
    sendConnectionRequestController, acceptConnectionRequestController,
    getUserConnectionController, followersOfUserController
} from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../configs/multer.js';

const userRouter = express.Router();

userRouter.get('/data-user', protect, getUserController)
userRouter.post('/find-user', protect, findUserController)

userRouter.post('/update-user', upload.fields([{ name: 'profile', maxCount: 1 },{ name: 'cover', maxCount: 1 }]), protect, updateUserController)
userRouter.delete('/delete-user', protect, deleteUserController)

userRouter.get('/followers-of-user', protect, followersOfUserController)
userRouter.post('/follow-user', protect, followUserController)
userRouter.post('/unfollow-user', protect, unfollowUserController)

userRouter.post('/send-connection-request', protect, sendConnectionRequestController)
userRouter.post('/accept-connection-request', protect, acceptConnectionRequestController)
userRouter.get('/user-connection', protect, getUserConnectionController)

export default userRouter