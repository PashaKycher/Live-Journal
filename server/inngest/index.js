import { Inngest } from "inngest";
import User from "../models/User.js";
import Connection from "../models/Connection.js";
import sendEmail from "../configs/nodeMailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "livejournal-app" });

// Function to save user data to a database
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        let username = email_addresses[0].email_address.split('@')[0]

        // Check availability of username
        const user = await User.findOne({ username })

        if (user) {
            username = username + Math.floor(Math.random() * 10000)
        }

        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            full_name: first_name + ' ' + last_name,
            username,
            profile_picture: image_url,
        }
        await User.create(userData)
    }
)

// Function to update user data in database
const syncUserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data

        const updatedUserData = {
            email: email_addresses[0].email_address,
            full_name: first_name + ' ' + last_name,
            profile_picture: image_url,
        }
        await User.updateOne({ _id: id }, { $set: updatedUserData })
    }
)

// Delete user data from database
const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-from-clerk' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { id } = event.data
        await User.deleteOne({ _id: id })
    }
)

// Inngest Functions to send email when a new connection request is sent
const sendNewConnectionRequest = inngest.createFunction(
    { id: 'send-new-connection-request' },
    { event: 'app/connection-request' },
    async ({ event, step }) => {
        const {connectionId} = event.data
        await step.run('send-new-connection-request-mail', async ({ send }) => {
            const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id')
            const subject = `👋 New connection request from ${connection.from_user_id.full_name}`
            const body = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #333; margin-bottom: 20px;">
                    👋 New connection request from ${connection.from_user_id.full_name}
                </h2>
                <p style="color: #666; margin-bottom: 20px;">
                    Hello ${connection.to_user_id.full_name},
                </p>
                <p style="color: #666; margin-bottom: 20px;">
                    ${connection.from_user_id.full_name} has sent you a connection request.
                </p>
                <p style="color: #666; margin-bottom: 20px;">
                    You can accept or reject the request by visiting the following link:
                </p>
                <a href="${process.env.FRONTEND_URL}" style="color: #007BFF; text-decoration: none;">
                    here in LiveJournal
                </a>
                <p style="color: #666; margin-bottom: 20px;">
                    Thank you for using LiveJournal!
                </p>
            </div>
            `
            await sendEmail({
                from: connection.from_user_id.email,
                to: connection.to_user_id.email,
                subject,
                body,
            })
        })
    }
)
// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    sendNewConnectionRequest
];