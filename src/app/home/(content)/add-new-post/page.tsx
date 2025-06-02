"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

const addPostFormSchema = z.object({
  postTitle: z.string().min(4, { message: "Title must be at least 4 characters." }),
  content: z.string().min(10, { message: "Post must be at least 10 characters." }),
  tags: z.string().optional(),
  tone: z.enum(["informative", "creative", "formal", "casual"]),
  readability: z.enum(["simple", "medium", "advanced"]),
  audience: z.enum(["public", "followers", "private"])
});

export default function NewPost() {
  const [aiActive, setAiActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const addPostForm = useForm<z.infer<typeof addPostFormSchema>>({
    resolver: zodResolver(addPostFormSchema),
    defaultValues: {
      postTitle: "",
      content: "",
      tags: "",
      tone: "informative",
      readability: "simple",
      audience: "public",
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof addPostFormSchema>) => {
    console.log("Values: ", values)
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      console.log("Post saved successfully");
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 2500)
    } else {
      console.log("Post Save failed");
    }
  };

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
    <Form {...addPostForm}>
      <form onSubmit={addPostForm.handleSubmit(handleFormSubmit)} className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-white">Write a new post</h1>

        <div className="flex gap-2 items-start">
          <FormField
            control={addPostForm.control}
            name="postTitle"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Post title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" onClick={() => setAiActive(!aiActive)}>
            ✨ AI Assist
          </Button>
        </div>

        <FormField
          control={addPostForm.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea className="min-h-[200px]" placeholder="Write your post here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary">Enhance ✨</Button>
          <Button type="button" variant="secondary">Fix Grammar ✏️</Button>
          <Button type="button" variant="secondary">Change Tone 🎭</Button>
        </div>

        <FormField
          control={addPostForm.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Add tags" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <FormField
            control={addPostForm.control}
            name="tone"
            render={({ field }) => (
              <FormItem className="w-[200px]">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="informative">Informative</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={addPostForm.control}
            name="readability"
            render={({ field }) => (
              <FormItem className="w-[200px]">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select readability" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={addPostForm.control}
          name="audience"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select audience to share with" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="followers">Followers</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline">Generate Summary 📘</Button>
          <Button type="button" variant="outline">SEO Tips 📈</Button>
          <Button type="button" variant="outline">Image Suggestion 🖼</Button>
          <Button type="submit" className="ml-auto">Publish ⏩</Button>
        </div>

        {aiActive && (
          <Card className="bg-muted border border-border mt-4">
            <CardContent className="p-4 space-y-2">
              <h2 className="text-lg font-semibold">AI Tools Panel</h2>
              <Button type="button" variant="ghost">Generate Blog Outline</Button>
              <Button type="button" variant="ghost">Autowrite from Summary</Button>
              <Button type="button" variant="ghost">Rewrite in a Different Tone</Button>
              <Button type="button" variant="ghost">Improve Clarity & Language</Button>
            </CardContent>
          </Card>
        )}

        {success && (
          <div>Post saved successfully</div>
        )}
      </form>
    </Form>
  );
}
