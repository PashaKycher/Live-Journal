import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import Story from "../models/Story.js";
import fs from 'fs'
import { inngest } from "../inngest/index.js";

// Add story
export const addStoryController = async (req, res) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        const { content, media_type, background_color } = req.body;
        const media = req.file;
        let media_url = "";

        if (media_type === "image" || media_type === "video") {
            const fileBuffer = fs.readFileSync(media.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: media.originalname,
                folder: 'story'
            });
            media_url = response.url;
        }
        const story = new Story({ user: userId, content, media_url, media_type, background_color });
        await story.save();
        // schedule story deletion after 24 hours
        await inngest.send({
            name: 'app/story.delete',
            data: { storyId: story._id }
        })

        res.status(200).json({
            success: true,
            message: "Story added successfully"
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}

// Get stories
export const getStoriesController = async (req, res) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        const user = await User.findOne({ _id: userId })
        const usersIds = [userId, ...user.connection, ...user.following]
        const stories = await Story.find({ user: { $in: usersIds } }).populate("user").sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            error: false,
            stories
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}