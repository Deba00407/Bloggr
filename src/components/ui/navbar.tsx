import React from 'react'
import Link from 'next/link'
import { SignedOut, UserButton } from '@clerk/nextjs'
import { SignedIn } from '@clerk/nextjs'
import ThemeToggleButton from './themeToggleButton'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const Navbar = () => {
    const pathname = usePathname()
    return (
        <>
            <nav className="min-h-[50px] text-md flex items-center justify-between bg-transparent text-black dark:text-white px-4">

                <div className="h-[50px] flex items-center justify-center px-2">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        height={100}
                        width={100}
                        className="h-full rounded-full object-cover"
                    />
                </div>


                <div className="flex items-center justify-center gap-4">
                    <SignedOut>
                        <Link href="/login" className={`mr-4 ${pathname === "/login" ? "text-blue-500" : ""}`}>Login</Link>
                        <Link href="/register" className={`mr-4 ${pathname === "/register" ? "text-blue-500" : ""}`}>Register</Link>
                    </SignedOut>

                    <SignedIn>
                        <Link href="/home" className={`mr-4 ${pathname === "/home" ? "text-blue-500" : ""}`}>Home</Link>
                        <UserButton />
                    </SignedIn>

                    <ThemeToggleButton />
                </div>
            </nav>

        </>
    )
}

export default Navbar