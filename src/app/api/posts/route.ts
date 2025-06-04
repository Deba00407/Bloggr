import prisma from "@/lib/postgresConnection";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const values = await req.json();

        if (!values) {
            return new Response("Values received are empty", { status: 400 });
        }

        const {
            postTitle,
            audience,
            content,
            tags,
            readability,
            tone,
            filePath,
            user
        } = values;

        if (!user || !user.username || !user.imageUrl) {
            return new Response("Invalid or missing user data", { status: 400 });
        }

        const id = crypto.randomUUID()
        const postTags: string[] = tags.split(",")

        const newPost = await prisma.newPost.create({
            data: {
                id,
                postTitle,
                audience,
                content,
                tags: postTags,
                readability,
                tone,
                files: [filePath],
                author: user.username,
                authorAvatarURL: user.imageUrl
            }
        });

        return new Response(JSON.stringify(newPost), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error saving to PostgreSQL DB", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function GET() {
    try {
        const posts = await prisma.newPost.findMany()
        return NextResponse.json({
            posts
        }, { status: 200 })
    } catch (error) {
        console.log("Error getting posts");
        return NextResponse.json({
            message: "Fetching posts from DB failed"
        }, { status: 400 })
    }
}
