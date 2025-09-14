import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api/axios'

const initialState = {
    connections: [],
    pendingConnections: [],
    followers: [],
    following: []
}

export const fetchConnections  = createAsyncThunk('connections/fetchConnections', async (token) => {
    const {data} = await api.get('/api/user/user-connection', {headers: {Authorization: `Bearer ${token}`}})
    return data.success ? data : null
})

export const connectionsSlice = createSlice({
    name: 'connections',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder.addCase(fetchConnections.fulfilled, (state, action) => {
            if (action.payload) {
                state.connections = action.payload.connection
                state.pendingConnections = action.payload.pendingConnectionList
                state.followers = action.payload.followers
                state.following = action.payload.following
            }
        })
    }
})

export const {  } = connectionsSlice.actions

export default connectionsSlice.reducer