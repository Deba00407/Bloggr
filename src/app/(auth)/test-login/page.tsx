"use client"

import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

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
  })
})

const onFormSubmit = (values: z.infer<typeof formSchema>) => {
  console.log("The data are: ", values);
}

const TestLoginWithReactHook = () => {

  const testLoginForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  const { formState: {isSubmitting} } = useForm()


  return (
    <Form {...testLoginForm}>
      <form onSubmit={testLoginForm.handleSubmit(onFormSubmit)} className="max-w-4xl mx-auto p-6 space-y-6">
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

        <Button type="submit">
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default TestLoginWithReactHook