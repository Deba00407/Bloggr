import prisma from "@/lib/postgresConnection";
import { NextRequest, NextResponse } from "next/server";

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
            filesPath,
            user
        } = values;

        if (!user || !user.username || !user.imageUrl) {
            return new Response("Invalid or missing user data", { status: 400 });
        }

        const postTags: string[] = tags.split(", ")

        const newPost = await prisma.posts.create({
            data: {
                postTitle,
                audience,
                content,
                tags: postTags,
                readability,
                tone,
                files: filesPath,
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

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const queryField = searchParams.get("field");
    const queryValue = searchParams.get("value");

    let whereClause = {};

    if (queryField && queryValue) {
        whereClause = {
            [queryField]: {
                equals: queryValue,
                mode: "insensitive"
            }
        };
    }

    try {
        const posts = await prisma.posts.findMany({
            where: whereClause
        });

        return NextResponse.json({ posts }, { status: 200 });
    } catch (error) {
        console.log("Error getting posts", error);
        return NextResponse.json(
            { message: "Fetching posts from DB failed" },
            { status: 400 }
        );
    }
}


