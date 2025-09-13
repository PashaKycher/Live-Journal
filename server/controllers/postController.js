import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import Post from "../models/Post.js";
import fs from 'fs'


// Add post
export const addPostController = async (req, res) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        const { content, post_type } = req.body
        const images = req.files
        let image_urls = []
        if (images.length) {
            image_urls = await Promise.all(
                images.map(async (image) => {
                    const fileBuffer = fs.readFileSync(image.path)
                    const response = await imagekit.upload({
                        file: fileBuffer,
                        fileName: image.originalname,
                        folder: "posts"
                    })
                    const url = imagekit.url({
                        path: response.filePath,
                        transformation: [
                            { quality: 'auto' },
                            { format: 'webp' },
                            { width: '1280' }
                        ]
                    })
                    return url
                }))
        }
        const post = new Post({ user: userId, content, image_urls, post_type })
        await post.save()
        res.status(200).json({
            success: true,
            error: false,
            message: "Post added successfully"
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}

// get posts
export const getPostsController = async (req, res) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        const user = await User.findOne({ _id: userId })
        const usersIds = [ userId, ...user.connection, ...user.following ]
        const posts = await Post.find({user: { $in: usersIds }}).populate("user").sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            error: false,
            posts: posts
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}
// like post
export const likePostController = async (req, res) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        const { postId } = req.body
        const post = await Post.findById({ postId })
        if (post.likes_count.includes(userId)) {
            post.likes_count = post.likes_count.filter(user => user !== userId)
            await post.save()
            return res.status(200).json({
                success: true,
                error: false,
                message: "Post unliked successfully"
            })
        } else {
            post.likes_count.push(userId)
            await post.save()
            return res.status(200).json({
                success: true,
                error: false,
                message: "Post liked successfully"
            })
        }
    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}