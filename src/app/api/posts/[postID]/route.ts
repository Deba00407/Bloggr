import prisma from "@/lib/postgresConnection";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ postID: string }> }) {
    const {postID} = await context.params
    console.log(postID)

    try {
        const post = await prisma.posts.findFirst({
            where: {
                id: postID
            }
        })

        if (!post) {
            return NextResponse.json(
                { message: "Could not get post. Post ID is invalid" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            post,
            { status: 200 }
        );

    } catch (error) {
        console.log("Error getting post", error);
        return NextResponse.json(
            { message: "Fetching posts from DB failed" },
            { status: 400 }
        );
    }
}