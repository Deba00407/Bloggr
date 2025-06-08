import { NextResponse } from "next/server";
import prisma from "@/lib/postgresConnection";

export async function GET(req: Request, context: { params: Promise<{ username: string }> }) {
    const { username } = await context.params

    const userPosts = await prisma.posts.findMany({
        where: {
            author: username as string
        }
    })

    if (!userPosts) {
        return NextResponse.json({
            message: "User posts not found"
        }, {
            status: 400
        })
    }


    return NextResponse.json({
        userPosts
    }, {
        status: 200
    })
}