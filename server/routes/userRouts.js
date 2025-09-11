import express from 'express';
import {
    findUserController, getUserController, followUserController,
    unfollowUserController, deleteUserController, updateUserController
} from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../configs/multer.js';

const userRouter = express.Router();

userRouter.get('/data-user', protect, getUserController)
userRouter.post('/update-user', upload.fields([{ name: 'profile', maxCount: 1 },{ name: 'cover', maxCount: 1 }]), protect, updateUserController)
userRouter.post('/find-user', protect, findUserController)
userRouter.delete('/delete-user', protect, deleteUserController)
userRouter.post('/follow-user', protect, followUserController)
userRouter.post('/unfollow-user', protect, unfollowUserController)

export default userRouter