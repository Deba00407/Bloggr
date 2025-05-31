import React from 'react'
import Link from 'next/link'
import { SignedOut, UserButton } from '@clerk/nextjs'
import { SignedIn } from '@clerk/nextjs'
import ThemeToggleButton from './themeToggleButton'
import { usePathname } from 'next/navigation'

const Navbar = () => {
    const pathname = usePathname()
    return (
        <>
            <nav className="min-h-[50px] text-md flex items-center justify-center bg-transparent text-black dark:text-white">

                <SignedOut>
                    <Link href={"/"} className={`mr-4 ${pathname === "/" ? "text-blue-500" : ""}`}>Landing Page</Link>
                    <Link href={"/login"} className={`mr-4 ${pathname === "/login" ? "text-blue-500" : ""}`}>Login</Link>
                    <Link href={"/register"} className={`mr-4 ${pathname === "/register" ? "text-blue-500" : ""}`}>Register</Link>
                </SignedOut>


                <div className='flex items-center mr-4 justify-center'>
                    <SignedIn>
                        <Link href={"/home"} className={`mr-4 ${pathname === "/home" ? "text-blue-500" : ""}`}>Home</Link>
                        <UserButton />
                    </SignedIn>
                </div>

                <ThemeToggleButton />
            </nav>
        </>
    )
}

export default Navbar