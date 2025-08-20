import React from 'react'

const Loading = ({ height = '100vh' }) => {
    return (
        <div style={{ height }} className='flex items-center justify-center h-screen'>
            <div className='w-10 h-10 rounded-full border-purple-500 border-t-transparent border-3 animate-spin'>
            </div>
            <h1 className='ml-2'>Loading...</h1>
        </div>
    )
}

export default Loading