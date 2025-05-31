"use client"

import { useRouter } from "next/navigation"
import { useSignIn } from "@clerk/nextjs"
import Link from "next/link"

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

export default function ForgotPasswordPage() {
    const { isLoaded, signIn, setActive } = useSignIn()
    const [emailAddress, setEmailAddress] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [pendingVerification, setPendingVerification] = useState(false)
    const [verificationCode, setVerificationCode] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [sending, setSending] = useState(false)
    const [resetting, setResetting] = useState(false)

    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!isLoaded) return
        setSending(true)
        setError(null)

        try {
            await signIn.create({
                strategy: "reset_password_email_code",
                identifier: emailAddress,
            })
            setPendingVerification(true)
            setSuccess("Password reset code sent to your email!")
        } catch (error: any) {
            console.log(error)
            setError(error.errors?.[0]?.message || "Failed to send reset code")
        }

        setSending(false)
    }

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault()
        if (!isLoaded) return
        
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long")
            return
        }

        setResetting(true)
        setError(null)

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code: verificationCode,
                password: password,
            })

            if (result.status !== "complete") {
                setError("Password reset could not be completed")
                return
            }

            await setActive({
                session: result.createdSessionId,
            })
            
            setSuccess("Password reset successfully!")
            setTimeout(() => {
                router.push("/home")
            }, 1500)
        } catch (error: any) {
            console.log(error)
            setError(error.errors?.[0]?.message || "Failed to reset password")
        }
        
        setResetting(false)
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-lg">Loading...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
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

    if (success && !pendingVerification) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center text-green-600 mb-4">
                            <p className="font-medium">Success!</p>
                            <p className="text-sm">{success}</p>
                        </div>
                        <div className="text-center text-sm">
                            <span className="text-gray-600">Redirecting to home... </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {!pendingVerification ? (
                // Email Input Form
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Reset your password
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your email address and we'll send you a reset code
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

                        {success && (
                            <div className="text-center text-green-600 text-sm">
                                {success}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            onClick={handleSubmit}
                            className="w-full"
                            disabled={!isLoaded || sending}
                        >
                            {sending ? "Sending Reset Code..." : "Send Reset Code"}
                        </Button>

                        <div className="text-center text-sm space-y-2">
                            <div>
                                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                                    Back to sign in
                                </Link>
                            </div>
                            <div>
                                <span className="text-gray-600">Don't have an account? </span>
                                <Link href="/sign-up" className="text-blue-600 hover:underline font-medium">
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            ) : (
                // Password Reset Form
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Create new password
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter the verification code sent to {emailAddress} and your new password
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

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                New Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your new password"
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

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            onClick={handleVerify}
                            className="w-full"
                            disabled={!isLoaded || verificationCode.length !== 6 || !password || !confirmPassword || resetting}
                        >
                            {resetting ? "Resetting Password..." : "Reset Password"}
                        </Button>

                        <div className="text-center text-sm">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setPendingVerification(false)
                                    setSuccess(null)
                                }}
                                className="text-blue-600 hover:underline p-0 h-auto font-medium"
                            >
                                Back to email input
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </div>
    )
}