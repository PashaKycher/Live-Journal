import React, { useEffect, useState } from 'react'
import { User, UserPlus, UserCheck, UserRoundPen, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import { fetchConnections } from '../features/connectionsSlice'
import toast from 'react-hot-toast'
import api from '../api/axios'

const Connection = () => {
  const { getToken } = useAuth()
  const [currentTab, setCurrentTab] = useState('Followers')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { followers, following, pendingConnections, connections } = useSelector(state => state.connections)

  const dataArray = [
    { label: 'Followers', icon: User, value: followers, emptyText: 'No followers yet' },
    { label: 'Following', icon: UserCheck, value: following, emptyText: 'Not following anyone yet' },
    { label: 'Pending', icon: UserRoundPen, value: pendingConnections, emptyText: 'No pending connections' },
    { label: 'Connections', icon: UserPlus, value: connections, emptyText: 'No connections yet' },
  ]

  const handleUnfollow = async (userId) => {
    try {
      const token = await getToken()
      const { data } = await api.post('/api/user/unfollow-user', { id: userId }, { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        toast.success(data.message)
        dispatch(fetchConnections(token))
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const acceptConnection = async (userId) => {
    try {
      const token = await getToken()
      const { data } = await api.post('/api/user/accept-connection-request', { id: userId }, { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        toast.success(data.message)
        dispatch(fetchConnections(token))
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getToken().then(token => {
      dispatch(fetchConnections(token))
    })
  }, [])

  return (
    <div className='man-h-screen bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Connections</h1>
          <p className='text-slate-500'>Manage your network and discover new connections</p>
        </div>

        {/* Counts */}
        <div className='mb-8 flex flex-wrap gap-6'>
          {dataArray.map((item, index) => (
            <div key={index + 'dataArray1'} className='flex flex-col items-center justify-center gap-1
            border h-20 w-40 border-gray-200 bg-white shadow rounded-md'>
              <b>{item?.value?.length || 0}</b>
              <p className='text-slate-600'>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className='inline-flex flex-wrap items-center border border-gray-200
        rounded-md p-1 bg-white shadow-md'>
          {dataArray.map((item, index) => (
            <button key={index + 'dataArray2'} className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors cursor-pointer 
            ${currentTab === item.label ? 'bg-white font-medium text-black' : 'text-gray-500 hover:text-black'}`}
              onClick={() => setCurrentTab(item.label)}>
              <item.icon className='w-4 h-4' />
              <span className='ml-1'>{item.label}</span>
              {item.count !== undefined && (
                <span className='ml-2 tect-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full'>
                  {item.count || 0}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Connections */}
        <div className='flex flex-wrap gap-6 mt-6'>
          {dataArray.find(item => item.label === currentTab).value.map((user, index) => (
            <div key={index + user._id + 'connections'}
              className='w-full max-w-88 flex gap-5 p-6 bg-white shadow rounded-md'>
              <img src={user.profile_picture} alt="" className='rounded-full w-12 h-12 shadow-md mx-auto object-cover' />

              <div className='flex-1'>
                <p className='font-medium text-slate-700'>{user.full_name}</p>
                <p className='text-slate-500'>@{user.username}</p>
                <p className='text-sm text-gray-600'>{user.bio.slice(0, 30)}...</p>

                <div className='flex max-sm:flex-col gap-2 mt-4'>
                  <button className='w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600
                  hover:from-indigo-600 hover:to-purple-700 action:scale-95 transition text-white cursor-pointer'
                    onClick={() => navigate(`/profile/${user._id}`)}>
                    View Profile
                  </button>

                  {currentTab === 'Following' && (
                    <button className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black
                    active:scale-95 transition cursor-pointer'
                    onClick={() => handleUnfollow(user._id)}>
                      Unfollow
                    </button>)}

                  {currentTab === 'Pending' && (
                    <button className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black
                    active:scale-95 transition cursor-pointer'
                    onClick={() => acceptConnection(user._id)}>
                      Accept
                    </button>)}

                  {currentTab === 'Connections' && (
                    <button className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800
                    active:scale-95 transition cursor-pointer flex items-center justify-center gap-1'
                      onClick={() => navigate(`/messages/${user._id}`)}>
                      <MessageSquare className='w-4 h-4' />
                      Message
                    </button>)}
                </div>
              </div>
            </div>))}
        </div>
      </div>
    </div>
  )
}

export default Connection