import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center font-sans">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">404</h1>
            <p className="text-lg text-gray-600 mb-6">
                Oops! The page you are looking for cannot be found.
            </p>
            <div className="w-full max-w-md mb-6">
                <Image
                    src="/notFound.jpg"
                    alt="Astronaut"
                    width={500}
                    height={300}
                    className="rounded-xl object-cover w-full h-auto"
                    priority
                />
            </div>
            <Link href="/">
                <Button className="px-6 py-2 text-base hover:bg-primary/90 transition">
                    Go to homepage
                </Button>
            </Link>
        </div>
    )
}

export default NotFound
