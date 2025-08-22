import { BadgeCheck, X } from 'lucide-react'
import React, { use, useEffect, useState } from 'react'

const StoryViewer = ({ viewStory, setViewStory }) => {
    const [textProgress, setTextProgress] = useState(0)
    const [imageProgress, setImageProgress] = useState(0)

    const hendleClose = () => {
        setViewStory(null)
    }

    const renderContent = () => {
        switch (viewStory.media_type) {
            case 'image':
                return (
                    <img src={viewStory.media_url} alt="" className='max-w-full max-h-screen object-contain' />
                );
            case 'video':
                return (
                    <video src={viewStory.media_url} controls className='max-h-screen'
                        onEnded={() => setViewStory(null)} autoPlay />
                );
            case 'text':
                return (
                    <div className='w-full h-full flex items-center justify-center text-white p-8 text-2xl text-center'>
                        {viewStory.content}
                    </div>
                );
            default:
                return (null)
        }
    }

    if (textProgress >= 100 || imageProgress >= 100) {
        // Close the story viewer when progress reaches 100%
        setViewStory(null);
        return null;
    }

    useEffect(() => {
        if (viewStory) {
            // Reset progress when a new story is viewed
            setTextProgress(0);
            setImageProgress(0);

            // Simulate progress for text and image stories
            if (viewStory.media_type === 'text') {
                const interval = setInterval(() => {
                    setTextProgress((prev) => {
                        if (prev >= 100) {
                            clearInterval(interval);
                            return 100;
                        }
                        return prev + 0.2; // Increment progress
                    });
                }, 50); // Adjust speed as needed

                return () => clearInterval(interval);
            } else if (viewStory.media_type === 'image') {
                const interval = setInterval(() => {
                    setImageProgress((prev) => {
                        if (prev >= 100) {
                            clearInterval(interval);
                            return 100;
                        }
                        return prev + 0.5; // Increment progress
                    });
                }, 50); // Adjust speed as needed

                return () => clearInterval(interval);
            }
        }
    }, [viewStory, setViewStory]);

    return (
        <div className='fixed inset-0 h-screen bg-black bg-opacity-90 z-110 flex items-center justify-center'
            style={{ backgroundColor: viewStory.media_type === 'text' ? viewStory.background_color : '#000000' }}>
            {/* Progress bar (line) */}
            <div className='absolute top-0 left-0 w-full h-1 bg-gray-700'>
                <div className='h-full bg-white transition-all duration-100 linear'
                    style={{ width: viewStory.media_type === 'text' ? `${textProgress}%` : `${imageProgress}%` }}>
                </div>
            </div>
            {/*  User info - Top Left */}
            <div className='absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8
                    backdrop-blur-2xl rounded bg-black/50'>
                <img src={viewStory.user?.profile_picture} alt="" className='size-7 sm:size-8 rounded-full 
                        object-cover border border-white'/>
                <div className='text-white font-medium flex items-center gap-1.5'>
                    <span>{viewStory.user?.full_name}</span>
                    <BadgeCheck size={18} />
                </div>
            </div>
            {/* Close button */}
            <button onClick={hendleClose}
                className='absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none'>
                <X className='w-8 h-8 hover:scale-110 transition cursor-pointer' />
            </button>
            {/* Content Wrapper */}
            <div className='max-w-[90vw] max-h-[90vh] flex items-center justify-center'>
                {renderContent()}
            </div>
        </div>
    )
}

export default StoryViewer