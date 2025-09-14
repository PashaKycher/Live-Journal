import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'
import { toast } from 'react-hot-toast'

const initialState = {
    value: null
}

export const fetchUser  = createAsyncThunk('user/fetchUser', async (token) => {
    const {data} = await api.get('/api/user/data-user', {headers: {Authorization: `Bearer ${token}`}})
    return data.success ? data.user : null
})
export const updateUser  = createAsyncThunk('user/updateUser', async ({userData, token}) => {
    const {data} = await api.post('/api/user/update-user',userData, {headers: {Authorization: `Bearer ${token}`}})
    if (data.success) {
        toast.success(data.message)
        return data.user
    } else {
        toast.error(data.message)
        return null
    }
})
export const deleteUser  = createAsyncThunk('user/deleteUser', async (token) => {
    const {data} = await api.delete('/api/user/delete-user', {headers: {Authorization: `Bearer ${token}`}})
    if (data.success) {
        toast.success(data.message)
        return data.user
    } else {
        toast.error(data.message)
        return null
    }
})

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchUser.fulfilled, (state, action) => {
            state.value = action.payload
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            state.value = action.payload
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            state.value = action.payload
        })
    },
})

export const { login, logout } = userSlice.actions

export default userSlice.reducer