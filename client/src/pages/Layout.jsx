import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { dummyUserData } from '../assets/assets'
import Loading from '../components/Loading'

const Layout = () => {
  const [openSidebar, setOpenSidebar] = useState(false)
  // when we create backend we will chenge this
  const user = dummyUserData // most by from backend
  // -----------------------------------------

  return user ? (
    <div className='w-full flex h-screen'>
      <Sidebar user={user} openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <div className='flex-1 bg-slate-50'>
        <Outlet />
      </div>
      {
        openSidebar ?
          <X onClick={() => setOpenSidebar(false)}
            className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' /> :
          <Menu onClick={() => setOpenSidebar(true)}
            className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' />
      }
    </div>
  ) : (
    <Loading />
  )
}

export default Layout