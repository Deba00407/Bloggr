"use client"

import {
    ThumbsUp,
    MessageCircle,
    Bookmark,
    Share2,
    Calendar,
    Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import React from 'react'
import type { Post } from '@/app/home/page'

const formatCustom = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata"
    });
};

const ThisPost = () => {
    const postID = useParams().postID;

    const [post, setPost] = useState<Post | null>(null)
    const [error, setError] = useState("")

    // Get post data
    useEffect(() => {
        async function getPost() {
            try {
                const response = await fetch(`/api/posts/${postID}`);
                if (!response.ok) {
                    console.log("Failed to fetch post");
                    setError("Failed to fetch post")
                    return;
                }

                const data = await response.json();
                setPost(data);
            } catch (error) {
                console.log("Error fetching post:", error);
                setError(`Error fetching post`);
            }
        }

        if (postID) {
            getPost();
        }
    }, [postID]);

    const [likes, setLikes] = useState(123);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleLike = () => {
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
        setIsLiked(!isLiked);
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    const getReadingTime = (text: string) => {
        const wordsReadPerMin = 200
        const wordCount = text.trim().split(/\s+/).length;
        return Math.ceil(wordCount / wordsReadPerMin)
    }


    if (error) {
        return <div>{error}</div>;
    }

    if (post === null) {
        return <div>Loading.....</div>;
    }

    return (
        <div className="min-h-screen bg-white text-black dark:bg-zinc-950 dark:text-white">
            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                    <Link href="/home" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-black dark:text-white">Article</span>
                </nav>

                {/* Article Header */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                            {post.audience}
                        </Badge>
                        <Badge variant="outline" className="border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                            {post.readability}
                        </Badge>
                        <Badge variant="outline" className="border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                            {post.tone}
                        </Badge>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                        {post.postTitle}
                    </h1>

                    <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                        <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                                <AvatarImage src={post.authorAvatarURL} />
                                <AvatarFallback>SC</AvatarFallback>
                            </Avatar>
                            <span>By {post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatCustom(post.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{getReadingTime(post.content)} min read</span>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {post.files.length > 0 && (
                        <div className="relative w-full h-64 lg:h-96 rounded-lg overflow-hidden mb-8">
                            <Image
                                src={post.files[0]}
                                alt={post.postTitle}
                                height={100}
                                width={100}
                                className="w-full h-full object-cover bg-center bg-no-repeat"
                            />
                        </div>
                    )}
                </div>

                {/* Article Content */}
                <Card className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 p-8 mb-8">
                    <div className="prose prose-lg prose-zinc dark:prose-invert max-w-none">
                        {post.content.split('\n\n').map((paragraph, index) => {
                            if (paragraph.startsWith('## ')) {
                                return (
                                    <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                                        {paragraph.replace('## ', '')}
                                    </h2>
                                );
                            } else if (paragraph.startsWith('- ')) {
                                const listItems = paragraph.split('\n').filter(item => item.startsWith('- '));
                                return (
                                    <ul key={index} className="list-disc list-inside space-y-2 mb-6">
                                        {listItems.map((item, itemIndex) => (
                                            <li key={itemIndex} className="leading-relaxed">
                                                {item.replace('- **', '').replace('**', '').replace('- ', '')}
                                            </li>
                                        ))}
                                    </ul>
                                );
                            } else {
                                return (
                                    <p key={index} className="leading-relaxed mb-6">
                                        {paragraph}
                                    </p>
                                );
                            }
                        })}
                    </div>
                </Card>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map((tag, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        >
                            #{tag}
                        </Badge>
                    ))}
                </div>

                <Separator className="bg-zinc-300 dark:bg-zinc-800 mb-8" />

                {/* Interaction Buttons */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLike}
                        className={`flex items-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 ${isLiked ? 'text-blue-600 dark:text-blue-500' : 'text-zinc-600 dark:text-zinc-400'}`}
                    >
                        <ThumbsUp className="w-5 h-5" />
                        <span className="font-semibold">{likes}</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-zinc-600 hover:bg-zinc-200 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-semibold">45</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBookmark}
                        className={`flex items-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 ${isBookmarked ? 'text-yellow-500' : 'text-zinc-600 dark:text-zinc-400'}`}
                    >
                        <Bookmark className="w-5 h-5" />
                        <span className="font-semibold">67</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-zinc-600 hover:bg-zinc-200 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                    >
                        <Share2 className="w-5 h-5" />
                        <span className="font-semibold">89</span>
                    </Button>
                </div>

                {/* Author Card */}
                <Card className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 p-6">
                    <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={post.authorAvatarURL} />
                            <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{post.author}</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                                Senior Software Engineer and AI enthusiast with over 8 years of experience in full-stack development.
                                Passionate about exploring the intersection of artificial intelligence and modern software practices.
                            </p>
                            <Button variant="outline" size="sm" className="border-zinc-300 text-zinc-700 hover:bg-zinc-200 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                                Follow Author
                            </Button>
                        </div>
                    </div>
                </Card>
            </main>
        </div>

    );
}

export default ThisPost;
