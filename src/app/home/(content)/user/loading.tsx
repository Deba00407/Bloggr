import Image from "next/image"

export default function Loading() {
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