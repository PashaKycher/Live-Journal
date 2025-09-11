import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/userRouts.js';

const app = express();
await connectDB();

app.use(cors());
app.use(express.json());

// auth from ' https://clerk.com/ '
app.use(clerkMiddleware())
app.get('/', (req, res) => { res.send("Server is running"); })
// inngest - ' https://inngest.com/ '
app.use('/api/inngest', serve({ client: inngest, functions }));
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));