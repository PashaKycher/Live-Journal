import { configureStore } from '@reduxjs/toolkit';
import userReduser from '../features/userSlice.js';
import messagesReduser from '../features/messagesSlice.js';
import connectionsReduser from '../features/connectionsSlice.js';

export const store = configureStore({
    reducer: {
        user: userReduser,
        messages: messagesReduser,
        connections: connectionsReduser
    },
});
