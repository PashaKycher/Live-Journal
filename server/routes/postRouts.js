import express from "express";
import { upload } from "../configs/multer.js";
import { protect } from "../middlewares/auth.js";
import { addPostController, getPostsController, likePostController } from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.post('/add-post', upload.array('images', 10), protect, addPostController)
postRouter.get('/get-post', protect, getPostsController)
postRouter.post('/like-post', protect, likePostController)

export default postRouter