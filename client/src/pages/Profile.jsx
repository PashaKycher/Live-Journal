import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyPostsData, dummyUserData } from '../assets/assets'
import Loading from '../components/Loading'
import UserProfileInfo from '../components/UserProfileInfo'
import PostCard from '../components/PostCard'
import moment from 'moment'
import ProfileModel from '../components/ProfileModel'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import api from '../api/axios'

const Profile = () => {
  const { profileId } = useParams()
  const {getToken} = useAuth()
  const currentUser = useSelector(state => state.user.value)

  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEdit, setShowEdit] = useState(false)

  const fetchUser = async (profileId) => {
    const token = await getToken()
    try {
      const {data} = await api.post(`/api/user/get-user-profile`, {profileId}, {headers: {Authorization: `Bearer ${token}`}})
      if (data.success) {
        setUser(data.profile)
        setPosts(data.posts)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (profileId) {
      fetchUser(profileId)
    }else {
      fetchUser(currentUser._id)
    }
  }, [profileId, currentUser])

  return user ? (
    <div className='reletive h-full overflow-y-scroll bg-gray-50 p-6'>
      <div className='max-w-3xl mx-auto'>
        {/* Profile Card */}
        <div className='bg-white rounded-2xl shadow overflow-hidden'>
          {/* Cover Photo */}
          <div className='h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200'>
            {user.cover_photo && <img src={user.cover_photo} alt='' className='w-full h-full object-cover' />}
          </div>
          {/* User Info */}
          <UserProfileInfo user={user} posts={posts} profileId={profileId} setShowEdit={setShowEdit} />
        </div>

        {/* Tabs */}
        <div className='mt-6'>
          <div className='bg-white rounded-xl shadow p-1 flex max-w-md mx-auto'>
            {['posts', 'media', 'likes'].map((tab, index) => (
              <button className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer
              ${activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-gray-900"}`}
                key={index + 'tab'}
                onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>))}
          </div>

          {/* Posts */}
          {activeTab === 'posts' && (
            <div className='mt-6 flex flex-col items-center gap-6'>
              {posts.map((post) => <PostCard key={post._id} post={post} />)}
            </div>
          )}

          {/* Media */}
          {activeTab === 'media' && (
            <div className='flex flex-wrap mt-6 max-w-6xl'>
              {posts.filter((post) => post.image_urls.length > 0).map((post) => (<div key={post._id + 'postMedia'}
              className='flex flex-wrap mt-6 max-w-6xl'>
                {post.image_urls.map((image, index) => (<Link to={image} target='_blank' key={index}
                  className='relative group p-2 '>
                  <img src={image} alt='' className='w-60 aspect-video object-cover' key={index} />
                  <p className='absolute bottom-2 right-2 text-xs p-1 px-3 backdrop-blur-xl
                  text-white opacity-0 group-hover:opacity-100 transition duration-300'>
                    Paster {moment(post.createdAt).fromNow()}</p>
                </Link>))}
              </div>))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && <ProfileModel onClose={() => setShowEdit(false)} user={user} />}
    </div>
  ) : (<Loading />)
}

export default Profile