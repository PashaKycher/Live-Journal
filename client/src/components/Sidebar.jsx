import React from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems'
import { CirclePlus, LogOut } from 'lucide-react'
// from ' https://clerk.com/ '
import { UserButton, useClerk } from '@clerk/clerk-react'

const Sidebar = ({ user, openSidebar, setOpenSidebar }) => {
    const navigate = useNavigate()
    const userData = user ? user : {
        full_name: 'Anonymous',
        username: 'anonymous@gmail.com',
    }
    // from ' https://clerk.com/ '
    const { signOut } = useClerk()

    return (
        <div className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between 
        items-center max-sm:absolute top-0 bottom-0 z-20 ${openSidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'}
        transition duration-300 ease-in-out`}>
            <div className='w-full'>
                <img src={assets.logo} alt='' className='w-26 ml-7 my-2 cursor-pointer' onClick={() => navigate('/')} />
                <hr className='border-gray-300 mb-8' />

                <MenuItems setOpenSidebar={setOpenSidebar} />

                <Link to='/create-post' className='flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg
                bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800
                active:scale-95 transition text-white cursor-pointer'>
                    <CirclePlus className='w-5 h-5' />
                    Create Post
                </Link>
            </div>

            <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
                <div className='flex items-center gap-2 cursor-pointer'>
                    {/* // from ' https://clerk.com/ ' */}
                    <UserButton />

                    <div>
                        <h1 className='text-sm font-medium'>{userData.full_name}</h1>
                        <p className='text-xs text-gray-500'>@{userData.username}</p>
                    </div>
                </div>

                <LogOut onClick={() => signOut()} 
                    className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer'/>
            </div>
        </div>
    )
}

export default Sidebar