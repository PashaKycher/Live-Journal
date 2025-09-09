import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Pencil, X } from 'lucide-react'

const ProfileModel = ({ onClose }) => {
    const user = dummyUserData
    const [editForm, setEditForm] = useState({
        full_name: user.full_name,
        username: user.username,
        bio: user.bio,
        location: user.location,
        profile_picture: null,
        cover_photo: null,
    })

    const handleOnChange = (e) => {
        setEditForm({ ...editForm, [e.target.id]: e.target.value })
    }

    const handleSaveProfile = async (e) => {
        e.preventDefault()
    }

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 z-110 h0screen overflow-y-scroll bg-black/50'>
            <div className='max-w-2xl sm:py-6 mx-auto'>
                <div className='bg-white rounded-lg shadow p-6'>
                    <div className='flex items-center justify-between mb-6'>
                        <h1 className='text-2xl font-bold text-gray-900'>Edit Profile</h1>
                        <X onClick={onClose} className='w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900' />
                    </div>

                    <form className='space-y-4' onSubmit={handleSaveProfile}>
                        {/* Profile Picture */}
                        <div className='flex flex-col items-start gap-3'>
                            <label htmlFor="profile_picture" className='block text-sm font-medium text-gray-700 mb-1'>
                                Profile Picture
                                <input type="file" id="profile_picture" accept='image/*'
                                    className='w-full p-3 border border-gray-200 rounded-lg hidden'
                                    onChange={(e) => setEditForm({ ...editForm, profile_picture: e.target.files[0] })} />
                                <div className='group/profile relative'>
                                    <img alt="" className='w-24 h-24 rounded-full object-cover mt-2'
                                        src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture)
                                        : user.profile_picture} />

                                    <div className='absolute hidden group-hover/profile:flex top-0 bottom-0
                                    left-0  right-0 bg-black/20 rounded-full items-center justify-center'>
                                        <Pencil className='w-5 h-5 text-white' />
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Cover Photo */}
                        <div className='flex flex-col items-start gap-3'>
                            <label htmlFor="cover_photo" className='block text-sm font-medium text-gray-700 mb-1'>
                                Cover Photo
                                <input type="file" id="cover_photo" accept='image/*'
                                    className='w-full p-3 border border-gray-200 rounded-lg hidden'
                                    onChange={(e) => setEditForm({ ...editForm, cover_photo: e.target.files[0] })} />
                                <div className='group/cover relative'>
                                    <img alt="" className='w-80 h-40 rounded-lg bg-gradient-to-r mt-2
                                    from-indigo-200 via-purple-200 to-pink-200 object-cover'
                                        src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : user.cover_photo} />

                                    <div className='absolute hidden group-hover/cover:flex top-0 bottom-0
                                    left-0 right-0 bg-black/20 rounded-lg items-center justify-center'>
                                        <Pencil className='w-5 h-5 text-white' />
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* User Info */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Name
                            </label>
                            <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' id='full_name'
                            placeholder='Please enter your full name' onChange={handleOnChange} value={editForm.full_name} />   
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Username
                            </label>
                            <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' id='username'
                            placeholder='Please enter your username' onChange={handleOnChange} value={editForm.username} />   
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Bio
                            </label>
                            <textarea rows={3} className='w-full p-3 border border-gray-200 rounded-lg' id='bio'
                            placeholder='Please enter your bio' onChange={handleOnChange} value={editForm.bio} />   
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Location
                            </label>
                            <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' id='location'
                            placeholder='Please enter your location' onChange={handleOnChange} value={editForm.location} />   
                        </div>
                        <div className='flex justify-end space-x-3 pt-6'>
                            <button className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 cursor-pointer
                            hover:bg-gray-50 transition-colors' onClick={onClose} type='button'>Cancel</button>
                            <button className='px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 transition cursor-pointer
                            rounded-lg hover:from-indigo-600 hover:to-purple-600 text-white' type='submit'>Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProfileModel