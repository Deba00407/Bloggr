import connectToDB from "@/lib/dbConnection"
import Post from "@/app/schemas/postSchema"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const values = await req.json()

    if (!values) {
        return new Response("Values received are empty", { status: 400 })
    }

    const user = values.user

    await connectToDB()

    try {
        await Post.create({
            postTitle: values.postTitle,
            audience: values.audience,
            content: values.content,
            tags: values.tags,
            readability: values.readability,
            tone: values.tone,
            files: values.filePath,
            author: user.username,
            authorAvatarURL: user.imageUrl
        });

        console.log("✅ Post saved successfully");
        return new Response("Post saved successfully", { status: 201 });
    } catch (err) {
        console.log("❌ Error in saving post to DB:", err);
        return new Response("Failed to save post", { status: 500 });
    }
}

export async function GET(){
    await connectToDB()

    try {
        const posts = await Post.find()
        return NextResponse.json({
            posts
        }, {status: 200})
    } catch (error) {
        console.log("Error getting posts");
        return NextResponse.json({
            message: "Fetching posts from DB failed"
        }, {status: 400})
    }
}