import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import Message from "../models/Message.js";
import fs from 'fs'
import { inngest } from "../inngest/index.js";

// Create an empty object to store ServerSaiteEvent connections
const connections = {};

// Controller function for the SSE endpoint
export const sseController = (req, res) => {
    const { userId } = req.params;
    console.log('New client connected : ', userId)

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Add the client connection to the connections object
    connections[userId] = res;

    // Send an initial message to the client
    res.write('Log: Connected to SSE stream\n\n');

    // Handle client disconnection
    req.on('close', () => {
        console.log('Client disconnected : ', userId)
        delete connections[userId];
    });
}

// Send Message
export const sendMessageController = async (req, res) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        const { to_user_id, text } = req.body
        const image = req.files
        let media_url = "";
        let message_type = image ? "image" : "text";
        if (message_type === "image") {
            const buffer = fs.readFileSync(image.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: image.originalname,
                folder: "messages"
            })
            media_url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1280' }
                ]
            })
        }
        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            text,
            media_url,
            message_type
        })
        res.status(200).json({
            success: true,
            error: false,
            message: "Message sent successfully",
            message
        })
        // Send message to to_user_id using SSE
        const messageWithUserData = await Message.findOne({ _id: message._id }).populate("from_user_id")
        if (connections[to_user_id]) {
            connections[to_user_id].write(`Data: ${JSON.stringify(messageWithUserData)}\n\n`);
        }
    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}

// Get Chat Messages
export const getChatMessagesController = async (req, res) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        const { to_user_id } = req.body;
        const messages = await Message.find({ 
            $or: [
                { from_user_id: userId, to_user_id: to_user_id }, 
                { from_user_id: to_user_id, to_user_id: userId }
            ] }).sort({ createdAt: -1 })
            // mark messages as seen
            await Message.updateMany({from_user_id: to_user_id, to_user_id: userId}, { seen: true })
        res.status(200).json({
            success: true,
            error: false,
            messages
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}

// Get User Recend Messages
export const getUserRecendMessages = async (req, res) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        const messages = await Message.find({ to_user_id: userId }).populate("from_user_id to_user_id").sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            error: false,
            messages
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}
