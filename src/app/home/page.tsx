import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import Image from 'next/image'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Globe, Users, Lock, BookOpen, MessageSquare, AlertCircle, Image as ImageIcon } from 'lucide-react';

type Post = {
  postTitle: string,
  audience: string,
  content: string,
  readability: string,
  tone: string,
  tags: string[],
  files: string[]
}

const Home = async () => {
  const getUserDetails = async () => {
    "use server"
    const user = await currentUser()
    if (!user) {
      return "No user found"
    }

    return user.username
  }

  const user = await getUserDetails()
  var error: string = ""


  const getAllPosts = async () => {
    "use server"
    try {
      const response = await fetch(`${process.env.FRONTEND_BASE_URL}/api/posts`, {
        method: "GET"
      })
      if (response.ok) {
        const data = await response.json()
        if (data.posts) {
          return data.posts
        } else {
          error = data.message
          return
        }
      }

    } catch (error) {
      console.log("Error fetching posts from Frontend")
    }
  }


  const posts: Post[] = await getAllPosts()

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'Public':
        return <Globe className="w-4 h-4" />;
      case 'Followers':
        return <Users className="w-4 h-4" />;
      case 'Private':
        return <Lock className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getAudienceColor = (audience: string) => {
    const audienceColors = {
      'Public': 'bg-green-100 text-green-800',
      'Followers': 'bg-blue-100 text-blue-800',
      'Private': 'bg-red-100 text-red-800'
    };
    return audienceColors[audience as keyof typeof audienceColors] || 'bg-gray-100 text-gray-800';
  };

  const getToneColor = (tone: string) => {
    const toneColors = {
      'Informative': 'bg-blue-100 text-blue-800',
      'Casual': 'bg-green-100 text-green-800',
      'Formal': 'bg-purple-100 text-purple-800',
      'Creative': 'bg-pink-100 text-pink-800'
    };
    return toneColors[tone as keyof typeof toneColors] || 'bg-gray-100 text-gray-800';
  };

  const getReadabilityColor = (readability: string) => {
    const readabilityColors = {
      'Simple': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-red-100 text-red-800'
    };
    return readabilityColors[readability as keyof typeof readabilityColors] || 'bg-gray-100 text-gray-800';
  };

  const ErrorAlert = ({ error }: { error: string }) => (
    <Alert className="max-w-4xl mx-auto mb-6" variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  const PostCard = ({ post }: { post: Post }) => {
    return (
      <Card className="w-full max-w-4xl mx-auto hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <div className="flex gap-4">
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              {post.files.length > 0 ? (
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border">
                  <Image
                    src={post.files[0]}
                    alt={`${post.postTitle} thumbnail`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-4 mb-3">
                <CardTitle className="text-xl font-semibold line-clamp-2 flex-1">
                  {post.postTitle}
                </CardTitle>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Badge className={getAudienceColor(post.audience)} variant="secondary">
                    {getAudienceIcon(post.audience)}
                    <span className="ml-1">{post.audience}</span>
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={getToneColor(post.tone)} variant="secondary">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {post.tone}
                </Badge>
                <Badge className={getReadabilityColor(post.readability)} variant="secondary">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {post.readability}
                </Badge>
              </div>

              <CardDescription className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {post.content}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags[0]
                .split(',')
                .map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag.trim()}
                  </Badge>
                ))}

            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Posts Dashboard</h1>
          {!error && <p className="text-gray-600">Displaying {posts.length} posts</p>}
        </div>

        {/* Show error if exists, otherwise show posts */}
        {error ? (
          <ErrorAlert error={error} />
        ) : (
          <div className="grid gap-6">
            {posts.map((post, index) => (
              <PostCard key={index} post={post} />
            ))}

            {posts.length === 0 && (
              <Card className="w-full max-w-4xl mx-auto">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No posts found</h3>
                  <p className="text-gray-600">There are no posts to display at the moment.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default Home