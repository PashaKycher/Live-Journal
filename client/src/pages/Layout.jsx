import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Loading from '../components/Loading'
import { useSelector } from 'react-redux'

const Layout = () => {
  const [openSidebar, setOpenSidebar] = useState(false)
  const user = useSelector(state => state.user.value)

  return user ? (
    <div className='w-full flex h-screen'>
      <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      
      <div className='flex-1 bg-slate-50'>
        <Outlet />
      </div>

      {
        openSidebar ?
          <X onClick={() => setOpenSidebar(false)}
            className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' /> 
            :
          <Menu onClick={() => setOpenSidebar(true)}
            className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' />
      }
    </div>
  ) : (
    <Loading />
  )
}

export default Layout