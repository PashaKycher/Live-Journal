import { ArrowLeft, Sparkle, TextIcon, Upload } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const StoryModel = ({ setShowModel, fethcStories }) => {
    const bgColor = ["#4f46e5", "#7c3aed", "#db2777", "#e11d48", "#ca8a04", "#0d9488"]

    const [mode, setMode] = useState('text')
    const [background, setBackground] = useState(bgColor[0])
    const [text, setText] = useState('')
    const [media, setMedia] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    const hendeleMediaUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setMedia(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const hendleCreateStory = async () => {
        setShowModel(false)
    }

    return (
        <div className='fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex 
        items-center justify-center p-4 overflow-y-auto'>
            <div className='w-full max-w-md'>
                {/* Header */}
                <div className='text-center mb-4 flex items-center justify-between'>
                    <button onClick={() => setShowModel(false)} className='text-white p-2 cursor-pointer'>
                        <ArrowLeft />
                    </button>
                    <h2 className='text-lg font-semibold'>Create Story</h2>
                    <span className='w-10'></span>
                </div>

                {/* Body */}
                <div className='rounded-lg h-96 flex items-center justify-center relative' style={{ backgroundColor: background }}>
                    {mode === 'text' && (
                        <textarea
                            className='bg-transparent w-full h-full text-white p-6 text-lg resize-none focus:outline-none'
                            placeholder='Write your story...'
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    )}
                    {
                        mode === 'media' && previewUrl && (
                            media?.type.startsWith('image') ? (
                                <img src={previewUrl} alt="Preview" className='object-cover max-h-full' />
                            ) : (
                                <video src={previewUrl} controls autoPlay className='object-cover max-h-full' />
                            )
                        )
                    }
                </div>

                <div className='flex mt-4 gap-2'>
                    {bgColor.map((color, index) => (
                        <button
                            key={index + color}
                            style={{ backgroundColor: color }}
                            className='w-6 h-6 rounded-full ring cursor-pointer'
                            onClick={() => setBackground(color)}
                        />
                    ))}
                </div>

                <div className='flex mt-4 gap-2'>
                    <button className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer
                    ${mode === 'text' ? 'bg-white text-black' : 'bg-zinc-800'}`}
                    onClick={() => {setMode('text'); setMedia(null); setPreviewUrl(null)}}>
                        <TextIcon size={18}/> Text
                    </button>
                    
                    <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer
                    ${mode === 'media' ? 'bg-white text-black' : 'bg-zinc-800'}`}>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            className='hidden'
                            onChange={(e) => {hendeleMediaUpload(e); setMode('media')}} 
                        />
                        <Upload size={18} /> Photo/Video
                    </label>
                </div>
                <button className='flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded
                bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700
                active:scale-95 transition cursor-pointer'
                // onClick whith used toast
                onClick={() => toast.promise(hendleCreateStory(), {
                    loading: 'Creating story...',
                    success: 'Story created successfully',
                    error: 'Error creating story'
                })}
                >
                    <Sparkle size={18} /> Create Story
                </button>
            </div>
        </div>
    )
}

export default StoryModel