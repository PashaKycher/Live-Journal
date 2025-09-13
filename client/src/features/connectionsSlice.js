import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    connections: [],
    pendingConnections: [],
    followers: [],
    following: []
}

export const connectionsSlice = createSlice({
    name: 'connections',
    initialState,
    reducers: {
        
    }
})

export const {  } = connectionsSlice.actions

export default connectionsSlice.reducer