import express from "express";
import { upload } from "../configs/multer.js";
import { protect } from "../middlewares/auth.js";
import { addStoryController, getStoriesController } from "../controllers/storyController.js";


const storyRouter = express.Router();

storyRouter.post('/add-story', upload.single('media'), protect, addStoryController)
storyRouter.get('/get-story', protect, getStoriesController)

export default storyRouter