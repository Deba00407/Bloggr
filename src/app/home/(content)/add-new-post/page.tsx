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
  FormLabel,
} from "@/components/ui/form"


import { Progress } from "@/components/ui/progress"

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";


const addPostFormSchema = z.object({
  postTitle: z.string().min(4, { message: "Title must be at least 4 characters." }),
  content: z.string().min(10, { message: "Post must be at least 10 characters." }),
  tags: z.string().optional(),
  tone: z.enum(["informative", "creative", "formal", "casual"]),
  readability: z.enum(["simple", "medium", "advanced"]),
  audience: z.enum(["public", "followers", "private"]),
  uploadFile: z.array(
    z.instanceof(File).refine((file) => file.size < 10 * 1024 * 1024, {
      message: "File size must be less than 10MB"
    })).min(1, { message: "Atleast one file is required" })
    .refine(
      (files) => files.every((file) => file.size < 10 * 1024 * 1024),
      "File size must be less than 10MB"
    )
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
      uploadFile: []
    },
  });

  const [progress, setProgress] = useState(0)
  const abortController = new AbortController()

  const handleFormSubmit = async (values: z.infer<typeof addPostFormSchema>) => {

    const filePath = await handleFileUpload(values)
    const postData = {
      ...values,
      filePath
    }

    console.log("Values: ", values)
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
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

  const authenticator = async () => {
    try {
      const response = await fetch("/api/upload-auth")
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error getting imagekit auth params:", errorText)
        return null
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Imagekit auth error:", error)
      return null
    }
  }

  // Handles file upload
  const handleFileUpload = async (values: z.infer<typeof addPostFormSchema>) => {

    const authParams = await authenticator()
    if (!authParams) {
      console.log("Unable to get auth params")
      return
    }

    const { token, publicKey, signature, expire } = authParams

    const file = values.uploadFile[0]

    if (!file || file === null) {
      console.log("File received was invalid")
      return
    }

    // Uploading file
    try {
      const fileName = crypto.randomUUID()

      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName,
        onProgress: (e) => setProgress((e.loaded / e.total) * 100),
        abortSignal: abortController.signal
      })

      console.log("Upload successfull")
      return uploadResponse.url
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        console.log("Upload aborted:", error);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.log("Invalid request:", error);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.log("Network error:", error);
      } else if (error instanceof ImageKitServerError) {
        console.log("Server error:", error);
      } else if (error instanceof ProgressEvent) {
        const xhr = error.target as XMLHttpRequest;
        console.log("Raw response:", xhr?.responseText);
      } else {
        console.log("Upload error:", error);
      }
    }
  }

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

        <FormField
          name="uploadFile"
          control={addPostForm.control}
          render={({ field }) => (
            <FormItem className="space-y-3 rounded-lg border border-border bg-card p-6 shadow-sm">
              <FormLabel className="text-sm font-medium text-foreground">
                Upload Files
              </FormLabel>

              <FormControl>
                <div className="relative">
                  <Input
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      field.onChange(files);
                    }}
                    className="cursor-pointer border-dashed border-2 border-border bg-background transition-colors hover:border-border/80 hover:bg-accent/50 file:mr-3 file:rounded-sm file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </div>
              </FormControl>

              {!!progress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    {progress && (
                      <div>
                        <span>Uploading...</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                    )}
                  </div>
                  <Progress value={progress} className="h-2 bg-secondary" />
                </div>
              )}

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
