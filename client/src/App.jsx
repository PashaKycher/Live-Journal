import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import Connection from './pages/Connection'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import Layout from './pages/Layout'
// from ' https://clerk.com/ '
import { useUser, useAuth } from '@clerk/clerk-react' //useAuth - to get token
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { fetchUser } from './features/userSlice'
import { fetchConnections } from './features/connectionsSlice'
import { useRef } from 'react'
import { addMessage } from './features/messagesSlice'
import Notification from './components/Notification'

const App = () => {
  // from ' https://clerk.com/ '
  const { user } = useUser()
  const { getToken } = useAuth()
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const pathnameRef = useRef(pathname)

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken()
        dispatch(fetchUser(token))
        dispatch(fetchConnections(token))
      }

    }
    fetchData()

  }, [user, getToken, dispatch])

  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    if (user) {
      const eventSource = new EventSource(import.meta.env.VITE_BASEURL + '/api/message/' + user.id)
      eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data)
        // console.log(message)
        // console.log(pathnameRef.current)
        // console.log('/messages' + message.from_user_id._id)
        if (pathnameRef.current === ('/messages/' + message.from_user_id._id)) {
          dispatch(addMessage(message))
        } else {
          toast.custom((t) => (<Notification t={t} message={message} />), { position: 'bottom-right' })
        }
      }
      return () => eventSource.close()
    }
  }, [user, dispatch])

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path='messages' element={<Messages />} />
          <Route path='messages/:userId' element={<ChatBox />} />
          <Route path='connections' element={<Connection />} />
          <Route path='discover' element={<Discover />} />
          <Route path='profile' element={<Profile />} />
          <Route path='profile/:profileId' element={<Profile />} />
          <Route path='create-post' element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  )
}

export default App