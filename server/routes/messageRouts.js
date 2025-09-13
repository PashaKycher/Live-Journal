import express from "express";
import { upload } from "../configs/multer.js";
import { protect } from "../middlewares/auth.js";
import { sseController, sendMessageController, getChatMessagesController } from "../controllers/messgeController.js";

const messageRouter = express.Router();

messageRouter.get('/:userId', sseController)
messageRouter.post('/send-message', upload.single('image'), protect, sendMessageController)
messageRouter.post('/get-chat-messages', protect, getChatMessagesController)

export default messageRouter