"use client"

import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";

import { Loader2Icon } from "lucide-react"

const formSchema = z.object({
  username: z.coerce.string().min(4, {
    message: "Username must be atleast 4 characters long"
  }),

  email: z.string().email({
    message: "Email entered is invalid"
  }),

  password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g, {
    message: "Password must be exactly 8 characters long and contain only uppercase letters (A-Z), lowercase letters (a-z), and periods (.)"
  }),

  uploadFile: z.array(
    z.instanceof(File).refine((file) => file.size < 10 * 1024 * 1024, {
      message: "File size must be less than 10MB"
    })).min(1, { message: "Atleast one file is required" })
    .refine(
      (files) => files.every((file) => file.size < 10 * 1024 * 1024),
      "File size must be less than 10MB"
    )
})

const TestLoginWithReactHook = () => {

  const testLoginForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      uploadFile: []
    }
  })

  const onFormSubmit = (values: z.infer<typeof formSchema>) => {
    handleFileUpload(values)
  }


  const { formState: { isSubmitting } } = useForm()


  const [progress, setProgress] = useState(0)
  const abortController = new AbortController()

  // Gets the auth parameters for imagekit
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
  const handleFileUpload = async (values: z.infer<typeof formSchema>) => {

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


  return (
    <Form {...testLoginForm}>
      <form encType="multipart-formdata" onSubmit={testLoginForm.handleSubmit(onFormSubmit)} className="max-w-4xl mx-auto p-6 space-y-6">
        {/* // Username */}
        <FormField
          control={testLoginForm.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* // Email */}
        <FormField
          control={testLoginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* // Password */}
        <FormField
          control={testLoginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* // Image */}
        <FormField
          name="uploadFile"
          control={testLoginForm.control}
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


        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2Icon className="animate-spin mr-2" />}
          Submit
        </Button>

      </form>
    </Form>
  )
}

export default TestLoginWithReactHook