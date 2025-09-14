import React, { useEffect, useState } from 'react'
import { assets, dummyPostsData } from '../assets/assets'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/PostCard'
import RecendMessages from '../components/RecendMessages'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'

const Feed = () => {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(false)
  const {getToken} = useAuth()

  const feathFeeds = async () => {
    try {
      setLoading(true)
      const token = await getToken()
      const {data} = await api.get('/api/post/get-post', { headers: { Authorization: `Bearer ${token}` } })
      setFeeds(data.posts)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    feathFeeds()
  }, [])

  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>

      {/* Srories and post list  */}
      <div>

        {/* Stories  */}
        <StoriesBar /> 

        {/* Post  */}
        <div className='p-4 space-y-6'>
          {
            feeds[0] && feeds.map((post, index) => (
              <PostCard key={index + post._id + 1} post={post} />
          ))
          }
        </div>
      </div>

      {/* Right sidebar  */}
      <div className='max-xl:hidden sticky top-0'>

        <div className='max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow'>
          <h3 className='yexy-slate-800 font-semibold'>Sponsores</h3>
          <img src={assets.sponsored_img} className='w-75 h-50 rounded-md' alt="" />
          <p className='text-slate-600'>Email marketing</p>
          <p className='text-slate-400'>
            Supercharge your marketing with a powerful, easy-to-use platform bult for results.
          </p>
        </div>

        <RecendMessages />
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default Feed