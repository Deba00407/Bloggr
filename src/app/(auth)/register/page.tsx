
"use client"

import { useRouter } from "next/navigation"
import { useSignUp } from "@clerk/nextjs"
import Link from "next/link"
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
import { useState } from "react"

export default function Page() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const [username, setUsername] = useState("")
    const [emailAddress, setEmailAddress] = useState("")
    const [password, setPassword] = useState("")
    const [pendingVerification, setPendingVerification] = useState(false)
    const [verificationCode, setVerificationCode] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [verifying, setVerifying] = useState(false)
    const [creatingAccount, setCreatingAccount] = useState(false)

    const router = useRouter()


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!isLoaded) return
        setCreatingAccount(true)

        try {
            await signUp.create({
                username,
                emailAddress,
                password
            }).then(async () => await signUp.prepareEmailAddressVerification({
                strategy: "email_code"
            })).then(() => setPendingVerification(!pendingVerification))
        } catch (error: any) {
            console.log(error);
            setError(error.errors[0].message)
        }

        setCreatingAccount(false)
    }

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault()
        if (!isLoaded) return
        setVerifying(true)

        try {
            const signUpResponse = await signUp.attemptEmailAddressVerification({ code: verificationCode })

            if (signUpResponse.status !== "complete") {
                setError("Verification could not be completed")
                return
            }

            await setActive({
                session: signUpResponse.createdSessionId,
            })
            router.push("/home")
        } catch (error: any) {
            console.log(error);
            setError(error.errors[0].message)
        }

        setVerifying(false)
    }

    const handleGitHubSignUp = async () => {
        if (!isLoaded) return;
        try {
            await signUp.authenticateWithRedirect({
                strategy: "oauth_github",
                redirectUrl: "/home",
                redirectUrlComplete: "http://localhost:3000/home"
            });
        } catch (err) {
            console.error("GitHub sign-up failed", err);
        }
    };


    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
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
                // Sign Up Form
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Create your account
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your details below to create your account
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Username
                            </label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

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
                                    placeholder="Create a password"
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
                                    {showPassword ? "Hide" : "Show"}
                                </Button>
                            </div>
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
                            {creatingAccount ? "Creating Account..." : "Create Account"}
                        </Button>

                        <Button
                            onClick={handleGitHubSignUp}
                            className="w-full flex items-center justify-center gap-3 bg-gray-800 text-white hover:bg-gray-900 transition-colors duration-200 rounded-md py-2 px-4 mt-3"
                        >
                            <Image src="/github.svg" alt="GitHub" width={20} height={20} className="invert" />
                            Sign up with GitHub
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-gray-600">Already have an account? </span>
                            <Link href="/login" className="text-blue-600 hover:underline font-medium">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            ) : (
                // Email Verification Form
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Verify your email
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
                            {verifying ? "Verifying..." : "Verify Email"}
                        </Button>

                        <div className="text-center text-sm">
                            <Button
                                variant="ghost"
                                onClick={() => setPendingVerification(false)}
                                className="text-blue-600 hover:underline p-0 h-auto font-medium"
                            >
                                Back to sign up
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </div>
    )

}

