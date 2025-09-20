import React, { useEffect, useRef, useState } from 'react'
import { dummyMessagesData, dummyUserData } from '../assets/assets';
import { ImageIcon, SendHorizonal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { addMessage, fetchMessages, resetMessages } from '../features/messagesSlice';
import api from '../api/axios';

const ChatBox = () => {
  const { userId } = useParams();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const { messages } = useSelector(state => state.messages);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);

  const messagesEndRef = useRef(null);

  const connections = useSelector(state => state.connections.connections);

  const fetchUserMessages = async () => {
    try {
      const token = await getToken();
      dispatch(fetchMessages({ token, userId }));
    } catch (error) {
      toast.error(error.message)
    }
  }

  const sendMessage = async () => {
    try {
      if (!text && !image) return;
      const token = await getToken();
      const formData = new FormData();
      formData.append('to_user_id', userId);
      formData.append('text', text);
      console.log(image)
      image && formData.append('image', image);
      const { data } = await api.post('/api/message/send-message', formData, { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        toast.success(data.message);
        setText("");
        setImage(null);
        dispatch(addMessage(data.messages));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchUserMessages()
    return () => {
      dispatch(resetMessages());
    }
  }, [userId])

  useEffect(() => {
    if (connections.length > 0) {
      const user = connections.find(connection => connection._id === userId);
      setUser(user);
    }
  }, [connections, userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return user && (
    <div className='flex flex-col h-screen'>
      <div className='flex items-center gap-2 p-2 md-px-10 xl:pl-42 bg-gradient-to-r 
      from-purple-50 to-pink-50 border-b border-gray-300'>
        <img src={user.profile_picture} alt="" className='size-8 rounded-full' />
        <div>
          <p className='font-medium'>{user.full_name}</p>
          <p className='text-sm text-gray-500 -mt-1.5'>@{user.username}</p>
        </div>
      </div>

      <div className='p-5 md:px-10 h-full overflow-y-scroll'>
        <div className='space-y-4 max-w-4xl mx-auto'>
          {
            messages.map((message, index) => (
              <div key={index + message._id} className={`flex flex-col
              ${message.to_user_id !== user._id ? 'items-start' : 'items-end'}`}>
                <div className={`p-2 text-sm max-w-sm text-slate-700 rounded-lg shadow
                ${message.to_user_id !== user._id ? 'rounded-bl-none bg-purple-50' : 'rounded-br-none bg-white'}`}>
                  {message.message_type === 'image' && message.media_url.map((url, index) => (
                    <img src={url} alt="" className='w-full max-w-sm rounded-lg mb-1' key={index + url} />
                  ))}
                  <p>{message.text}</p>
                </div>
              </div>
            ))
          }
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className='px-4'>
        <div className='flex items-center gap-3 p-1.5 pl-5 bg-white w-full max-w-xl mx-auto border 
        border-gray-200 shadow rounded-full mb-5'>
          <input type="text" className='flex-1 outline-none text-slate-700'
            placeholder='Type a message...' value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />

          <label htmlFor="image">
            {
              image ? (<img src={URL.createObjectURL(image)} alt="" className='h-8 rounded' />)
                : (<ImageIcon className='size-7 text-gray-400 cursor-pointer' />)
            }
            <input type="file" id='image' hidden onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
          </label>

          <button className='bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 
          hover:to-purple-800 active:scale-95 cursor-pointer text-white p-2 rounded-full'
            onClick={sendMessage} disabled={!text.trim() && !image}>
            <SendHorizonal size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBox