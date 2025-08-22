import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../assets/assets'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/PostCard'

const Feed = () => {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(false)

  const feathFeeds = async () => {

    try {
      setLoading(true)
      // when we create backend we will chenge this
      const data = await dummyPostsData
      setFeeds(data) // most by from backend
      // -----------------------------------------
      setLoading(false)
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
      <div className='hidden xl:block w-80 space-y-6'>

        <div>
          <h1>Sponsores</h1>
        </div>

        <h1>Recend messages</h1>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default Feed