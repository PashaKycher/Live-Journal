import React from 'react'
import { Route, Routes } from 'react-router-dom'
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
import { useUser } from '@clerk/clerk-react' //useAuth - to get token
// from Toaster
import { Toaster } from 'react-hot-toast'
// import { useEffect } from 'react'

const App = () => {
  // from ' https://clerk.com/ '
  const { user } = useUser()
  // const { getToken } = useAuth()
  // useEffect(() => {
  //   if(user){
  //     getToken().then((token) => console.log('token', token))
  //   }
  // },[user])

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