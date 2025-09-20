import React, { useState } from 'react'
import moment from 'moment'
import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react'
import { dummyUserData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const PostCard = ({ post }) => {
    const {getToken} = useAuth()
    const navigate = useNavigate()
    const posstWithHashtags = post.content.replace(/(#\w+)/g, '<span class="text-indigo-600 font-semibold">$1</span>')
    const [likes, setLikes] = useState(post.likes_count || 0)
    const currentUser = useSelector(state => state.user.value)
    const handLike = async() => {
        try {
            const token = await getToken()
            const {data} = await api.post('/api/post/like-post', {postId: post._id}, {headers: {Authorization: `Bearer ${token}`}})
            if (data.success) {
                setLikes(data.likes_count)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
            {/* User Info */}
            <div onClick={() => navigate(`/profile/${post.user._id}`)} className='flex items-center gap-3 cursor-pointer'>
                <img src={post.user.profile_picture} alt="" className='w-10 h-10 rounded-full shadow object-cover' />
                <div>
                    <div className='flex items-center space-x-1'>
                        <span>{post.user.full_name}</span>
                        <BadgeCheck className='w-4 h-4 text-blue-500' />
                    </div>
                    <div className='text-sm text-gray-500'>@{post.user.username} · {moment(post.createdAt).fromNow()}</div>
                </div>
            </div>
            {/* Content */}
            {post.content && <div className='text-gray-800 text-sm whitespace-pre-line'
                dangerouslySetInnerHTML={{ __html: posstWithHashtags }} />}
            {/* Image */}
            {post.image_urls[0] && (
                <div className='grid grid-cols-2 gap-2'>
                    {post.image_urls.map((url, index) => (
                        <img key={index + url} src={url} alt='' className={`w-full h-48 object-cover rounded-xl
                        ${post.image_urls.length === 1 && 'col-span-2 h-auto'}`} />
                    ))}
                </div>
            )}
            {/* Actions */}
            <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
                <div className='flex items-center gap-1'>
                    <Heart onClick={handLike}
                    className={`w-4 h-4 cursor-pointer ${likes?.includes(currentUser._id) && 'text-red-500 fill-red-500'}`} />
                    <span>{likes?.length ? likes.length : 0}</span>
                </div>
                {/* <div className='flex items-center gap-1'>
                    <MessageCircle className='w-4 h-4 cursor-pointer' />
                    <span>{12}</span>
                </div>
                <div className='flex items-center gap-1'>
                    <Share2 className='w-4 h-4 cursor-pointer' />
                    <span>{7}</span>
                </div> */}
            </div>
        </div>
    )
}

export default PostCard