import User from "../models/User.js";
import fs from 'fs'
import imagekit from "../configs/imageKit.js";
import Connection from "../models/Connection.js";
import Post from "../models/Post.js";
import Story from "../models/Story.js";
import { inngest } from "../inngest/index.js";

// get user data using userId
export const getUserController = async (req, res) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        const user = await User.findOne({ _id: userId })
        if (!user) {
            return res.status(404).json({
                success: false,
                error: true,
                message: "User not found"
            })
        }
        res.status(200).json({
            success: true,
            error: false,
            user: user
        })

    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}

// find user using username, email, location, name
export const findUserController = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { search } = req.body
        function escapeRegex(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
        const safeSearch = escapeRegex(search);
        const allUser = await User.find({
            $or: [
                { username: new RegExp(safeSearch, 'i') },
                { email: new RegExp(safeSearch, 'i') },
                { full_name: new RegExp(safeSearch, 'i') },
                { location: new RegExp(safeSearch, 'i') }
            ]
        }).limit(10)
        const filterredUsers = allUser.filter(user => user._id !== userId)
        res.status(200).json({
            success: true,
            error: false,
            user: filterredUsers,
            message: "User found successfully"
        })

    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}

// update user data using userId
export const updateUserController = async (req, res) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        let { full_name, username, bio, location } = req.body
        const tempUser = await User.findOne({ _id: userId })
        if (!tempUser) {
            return res.status(404).json({
                success: false,
                error: true,
                message: "User not found"
            })
        }
        if (username !== tempUser.username) {
            const user = await User.findOne({ username: username })
            if (user) {
                username = tempUser.username
            }
        }
        const updatedData = {
            full_name: full_name ? full_name : tempUser.full_name,
            username: username ? username : tempUser.username,
            bio: bio !== undefined && bio !== null ? bio : tempUser.bio,
            location: location !== undefined && location !== null ? location : tempUser.location,
        }
        const profile = req.files.profile && req.files.profile[0]
        if (profile) {
            const buffer = fs.readFileSync(profile.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: profile.originalname,
                folder: "profile"
            })
            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '512' }
                ]
            })
            updatedData.profile_picture = url
        }
        const cover = req.files.cover && req.files.cover[0]
        if (cover) {
            const buffer = fs.readFileSync(cover.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: cover.originalname,
                folder: "cover"
            })
            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1280' }
                ]
            })
            updatedData.cover_photo = url
        }
        const user = await User.findOneAndUpdate({ _id: userId }, updatedData, { new: true })
        res.status(200).json({
            success: true,
            error: false,
            user: user,
            message: "User updated successfully"
        })

    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}

// delete user using userId
export const deleteUserController = async (req, res) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        const user = await User.findOneAndDelete({ _id: userId })
        res.status(200).json({
            success: true,
            error: false,
            message: "User deleted successfully"
        })

    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}

// followers of user
export const followersOfUserController = async (req, res) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        const user = await User.findOne({ _id: userId }).populate("followers")
        const followers = user.followers
        res.status(200).json({
            success: true,
            error: false,
            followers: followers,
            message: "Get user followers successfully"
        })

    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}

// follow user
export const followUserController = async (req, res) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        const { id } = req.body
        const user = await User.findOne({ _id: userId })
        if (user.following.includes(id)) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "User already followed"
            })
        }
        user.following.push(id)
        await user.save()

        const toUser = await User.findOneAndUpdate({ _id: id }, { $push: { followers: userId } }, { new: true })

        res.status(200).json({
            success: true,
            error: false,
            user: user,
            message: "User followed successfully"
        })

    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}

// unfollow user
export const unfollowUserController = async (req, res) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        const { id } = req.body
        const user = await User.findOne({ _id: userId })
        if (!user.following.includes(id)) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "User not followed"
            })
        }
        user.following.pull(id)
        await user.save()

        const toUser = await User.findOneAndUpdate({ _id: id }, { $pull: { followers: userId } }, { new: true })

        res.status(200).json({
            success: true,
            error: false,
            user: user,
            message: "User unfollowed successfully"
        })

    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}

// send connection request
export const sendConnectionRequestController = async (req, res) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        const { id } = req.body
        // Check if user send more 20 requests per day
        const lastDay = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const requests = await Connection.find({ user: userId, createdAt: { $gte: lastDay } })
        if (requests.length >= 20) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "You can send only 20 connection requests per day"
            })
        }
        // Check if user already connected
        const connection = await Connection.findOne({
            $or: [
                { from_user_id: userId, to_user_id: id },
                { from_user_id: id, to_user_id: userId }
            ]
        })
        if (!connection) {
            const newConnection = await Connection.create({ to_user_id: id, from_user_id: userId })

            await inngest.send({
                name:'app/connection.request',
                data:{ connectionId: newConnection._id }
            })
            
            res.status(200).json({
                success: true,
                error: false,
                message: "Connection request sent successfully"
            })
        } else if (connection && connection.status === "accepted") {
            return res.status(400).json({
                success: false,
                error: true,
                message: "You already connected with this user"
            })
        }
        return res.status(400).json({
            success: false,
            error: true,
            message: "Connection request already sent"
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}

// accept connection request
export const acceptConnectionRequestController = async (req, res) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        const { id } = req.body
        const connection = Connection.findOne({ to_user_id: userId, from_user_id: id })
        if (!connection) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Connection request not found"
            })
        }
        const user = await User.findOneAndUpdate({ _id: userId }, { $push: { connection: id } }, { new: true })
        const toUser = await User.findOneAndUpdate({ _id: id }, { $push: { connection: userId } }, { new: true })
        connection.status = "accepted"
        await connection.save()
        res.status(200).json({
            success: true,
            error: false,
            message: "Connection request accepted successfully"
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}

// get user connection
export const getUserConnectionController = async (req, res) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        const user = await User.findById(userId).populate('connection followers following')
        const connection = user.connection
        const followers = user.followers
        const following = user.following

        const pendingConnection = await Connection.find({ to_user_id: userId, status: "pending" }).populate('from_user_id')
        const pendingConnectionList = pendingConnection.map(connection => connection.from_user_id)
        res.status(200).json({
            success: true,
            error: false,
            message: "User connection found successfully",
            connection,
            followers,
            following,
            pendingConnectionList
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}

// get user profile
export const getUserProfileController = async (req, res) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        const { profileId } = req.body
        const profile = await User.findById(profileId)
        if (!profile) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "User profile not found"
            })
        }
        const posts = await Post.find({ user: profileId }).populate("user").sort({ createdAt: -1 })
        const storys = await Story.find({ user: profileId }).populate("user").sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            error: false,
            message: "User profile found successfully",
            posts,
            profile,
            storys
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}
