"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewPost() {
  const [aiActive, setAiActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-48 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="flex flex-wrap gap-2 justify-between">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">Write a new post</h1>

      <div className="flex gap-2 items-start">
        <Input placeholder="Post title" className="flex-1" />
        <Button onClick={() => setAiActive(!aiActive)}>
          ✨ AI Assist
        </Button>
      </div>

      <Textarea className="min-h-[200px]" placeholder="Write your post here..." />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary">Enhance ✨</Button>
        <Button variant="secondary">Fix Grammar ✏️</Button>
        <Button variant="secondary">Change Tone 🎭</Button>
      </div>

      <Input placeholder="Add tags" />
      <div className="flex gap-4">
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="informative">Informative</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
            <SelectItem value="formal">Formal</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select readability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">Simple</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select audience to share with" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="public">Public</SelectItem>
          <SelectItem value="followers">Followers</SelectItem>
          <SelectItem value="private">Private</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline">Generate Summary 📘</Button>
        <Button variant="outline">SEO Tips 📈</Button>
        <Button variant="outline">Image Suggestion 🖼</Button>
        <Button className="ml-auto">Publish ⏩</Button>
      </div>

      {aiActive && (
        <Card className="bg-muted border border-border mt-4">
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-semibold">AI Tools Panel</h2>
            <Button variant="ghost">Generate Blog Outline</Button>
            <Button variant="ghost">Autowrite from Summary</Button>
            <Button variant="ghost">Rewrite in a Different Tone</Button>
            <Button variant="ghost">Improve Clarity & Language</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
