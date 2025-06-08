"use client"

import { useRouter } from "next/navigation"
import { useSignIn } from "@clerk/nextjs"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2Icon } from "lucide-react"

import { Eye, EyeClosed } from "lucide-react"

export default function Page() {
    const { isLoaded, signIn, setActive } = useSignIn()
    const [emailAddress, setEmailAddress] = useState("")
    const [password, setPassword] = useState("")
    const [pendingVerification, setPendingVerification] = useState(false)
    const [verificationCode, setVerificationCode] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loggingIn, setLoggingIn] = useState(false)

    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!isLoaded) return;
        setLoggingIn(true)

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (signInAttempt.status === "complete") {
                await setActive({ session: signInAttempt.createdSessionId });
                setTimeout(() => {
                    setLoggingIn(false)
                    router.push("/home");
                }, 1500)
            } else if (signInAttempt.status === "needs_second_factor") {
                await signIn.prepareSecondFactor({
                    strategy: "phone_code",
                });
                setPendingVerification(true);
            }
        } catch (error: any) {
            console.error("Sign-in error:", error);
            setError(error.errors?.[0]?.message || "Sign-in failed. Try again.");
        }
    }

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault()
        if (!isLoaded) return

        try {
            const signInAttempt = await signIn.attemptSecondFactor({
                strategy: "phone_code",
                code: verificationCode,
            })

            if (signInAttempt.status === "complete") {
                await setActive({ session: signInAttempt.createdSessionId })
                router.push("/home")
            } else {
                setError("Verification could not be completed")
            }
        } catch (error: any) {
            console.log(error)
            setError(error.errors[0].message)
        }
    }

    const handleGitHubLogin = async () => {
        if (!isLoaded) return
        try {
            await signIn.authenticateWithRedirect({
                strategy: "oauth_github",
                redirectUrl: "/home",
                redirectUrlComplete: "http://localhost:3000/home"
            })
        } catch (err) {
            console.error("GitHub login failed", err);
        }
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Image
                    src="/Loading-animation.gif"
                    alt="Loading..."
                    width={96}  
                    height={96}
                    priority
                />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12 px-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center text-red-600 mb-4">
                            <p className="font-medium">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                        <Button
                            onClick={() => setError(null)}
                            className="w-full"
                        >
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {!pendingVerification ? (
                // Sign In Form
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="emailAddress" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Email Address
                            </label>
                            <Input
                                id="emailAddress"
                                name="emailAddress"
                                type="email"
                                placeholder="Enter your email address"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeClosed/> : <Eye/>}
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <Link href={"/forgot-password"}>
                                <Button
                                    variant="link"
                                    className="px-0 font-normal text-sm text-blue-600 hover:underline"
                                >
                                    Forgot your password?
                                </Button>
                            </Link>
                        </div>

                        {/* CAPTCHA Element */}
                        <div id="clerk-captcha" className="flex justify-center"></div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            onClick={handleSubmit}
                            className="w-full"
                            disabled={!isLoaded}
                        >
                            {!!loggingIn && <Loader2Icon className="animate-spin"/>}
                            {loggingIn ? "Signing in...." : "Sign in"}
                        </Button>

                        <Button
                            onClick={handleGitHubLogin}
                            className="w-full flex items-center justify-center gap-3 bg-black text-white hover:bg-gray-900 transition-colors duration-200 rounded-md py-2 px-4"
                        >
                            <Image
                                src="/github.svg"
                                alt="GitHub"
                                width={20}
                                height={20}
                                className="invert"
                            />
                            Sign in with GitHub
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-gray-600">Don't have an account? </span>
                            <Link href="/register" className="text-blue-600 hover:underline font-medium">
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            ) : (
                // Two-Factor Authentication Form
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Two-Factor Authentication
                        </CardTitle>
                        <CardDescription className="text-center">
                            We've sent a verification code to {emailAddress}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="verificationCode" className="text-sm font-medium leading-none text-center block">
                                Enter verification code
                            </label>
                            <div className="flex justify-center">
                                <InputOTP
                                    maxLength={6}
                                    value={verificationCode}
                                    onChange={(value) => setVerificationCode(value)}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            onClick={handleVerify}
                            className="w-full"
                            disabled={!isLoaded || verificationCode.length !== 6}
                        >
                            Verify & Sign In
                        </Button>

                        <div className="text-center text-sm">
                            <Button
                                variant="ghost"
                                onClick={() => setPendingVerification(false)}
                                className="text-blue-600 hover:underline p-0 h-auto font-medium"
                            >
                                Back to sign in
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </div>
    )
}