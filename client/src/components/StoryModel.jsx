import { ArrowLeft } from 'lucide-react'
import React, { useState } from 'react'

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

    }

    return (
        <div className='fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex 
        items-center justify-center p-4'>
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
                </div>
            </div>
        </div>
    )
}

export default StoryModel