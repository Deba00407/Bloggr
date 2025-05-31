import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'

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

  return (
    <>
      <div>Hello {user}</div>
    </>
  )
}

export default Home