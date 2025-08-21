import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../assets/assets'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'

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
          List of post
        </div>
      </div>

      {/* Right sidebar  */}
      <div>

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