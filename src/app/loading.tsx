import React from 'react'
import Image from 'next/image'

const Loading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Image
                src="/Loading-animation.gif"
                alt="Loading..."
                width={96}
                height={96}
                priority
            />
        </div>
    )
}

export default Loading