import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

import { Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

import type { Post } from '../../page';


const UserPage = async () => {

    const user = await currentUser()

    const getUserPosts = async () => {
        const response = await fetch(`${process.env.FRONTEND_BASE_URL}/api/userPosts/${user?.username}`)
        if (!response.ok) {
            return []
        }

        const posts = await response.json()

        return posts.userPosts
    }

    const posts: Post[] = await getUserPosts()

    return <>
        <div className="min-h-screen text-white font-sans">
            {/* Header */}
            {/* <header className="border-b border-[#363636] px-10 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-4 h-4">
                                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold tracking-tight">Bloggr</h2>
                        </div>
                        <nav className="flex items-center gap-9">
                            <a href="#" className="text-sm font-medium hover:text-gray-300 transition-colors">
                                Home
                            </a>
                            <a href="#" className="text-sm font-medium hover:text-gray-300 transition-colors">
                                Create
                            </a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#adadad]" />
                            <Input
                                placeholder="Search"
                                className="w-64 h-10 bg-[#363636] border-none text-white placeholder:text-[#adadad] pl-10 focus:ring-0 focus:ring-offset-0"
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 bg-[#363636] hover:bg-[#4d4d4d]"
                        >
                            <Bell className="w-5 h-5" />
                        </Button>
                        <Avatar className="w-10 h-10">
                            <AvatarImage src="/api/placeholder/40/40" alt="Profile" />
                            <AvatarFallback>SB</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header> */}

            {/* Main Content */}
            <main className="px-40 py-5">
                <div className="max-w-[960px] mx-auto">
                    {/* Profile Section */}
                    <Card className="bg-transparent border-none shadow-none">
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center gap-4">
                                <Avatar className="w-32 h-32">
                                    <AvatarImage src={user?.imageUrl} alt="User profile" />
                                    <AvatarFallback className="text-2xl">SB</AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <h1 className="text-[22px] font-bold tracking-tight mb-1 text-black dark:text-white">
                                        {user?.username}
                                    </h1>
                                    <p className="text-gray-500 dark:text-[#adadad] text-base mb-1">
                                        Software Engineer | Tech Enthusiast
                                    </p>
                                    <p className="text-gray-500 dark:text-[#adadad] text-base">
                                        Joined in 2018
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <div className="flex gap-3 px-4 py-3">
                        <Card className="flex-1 bg-transparent border border-gray-300 dark:border-[#4d4d4d]">
                            <CardContent className="p-3 text-center">
                                <p className="text-2xl font-bold text-black dark:text-white mb-1">1.2K</p>
                                <p className="text-gray-500 dark:text-[#adadad] text-sm">Followers</p>
                            </CardContent>
                        </Card>
                        <Card className="flex-1 bg-transparent border border-gray-300 dark:border-[#4d4d4d]">
                            <CardContent className="p-3 text-center">
                                <p className="text-2xl font-bold text-black dark:text-white mb-1">850</p>
                                <p className="text-gray-500 dark:text-[#adadad] text-sm">Following</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Posts Section */}
                    <div className="mt-5">
                        <h2 className="text-[22px] font-bold tracking-tight px-4 pb-3 text-black dark:text-white">
                            Posts
                        </h2>

                        <div className="space-y-4">
                            {posts?.map((post: Post) => (
                                <Card key={post.id} className="bg-transparent border-none shadow-none">
                                    <CardContent className="p-4 rounded-md hover:bg-amber-50 hover:dark:bg-gray-500">
                                        <div className="flex gap-4">
                                            <div className="flex-[2] flex flex-col gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-gray-500 dark:text-[#adadad] text-sm">
                                                        {post.readability}
                                                    </p>
                                                    <h3 className="text-black dark:text-white text-base font-bold leading-tight">
                                                        {post.postTitle}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-[#adadad] text-sm leading-normal">
                                                        {post.content}
                                                    </p>
                                                </div>
                                                <Link href={`/home/posts/${post.id}`}>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="w-fit bg-gray-200 dark:bg-[#363636] text-black dark:text-white hover:bg-gray-300 dark:hover:bg-[#4d4d4d] border-none"
                                                    >
                                                        Read More
                                                    </Button>
                                                </Link>
                                            </div>
                                            <div className="flex-1">
                                                <div
                                                    className="w-full aspect-video bg-cover bg-center bg-no-repeat rounded-lg"
                                                    style={{ backgroundImage: `url(${post.files[0]})` }}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </>
}

export default UserPage