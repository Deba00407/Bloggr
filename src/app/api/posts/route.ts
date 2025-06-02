import connectToDB from "@/lib/dbConnection"
import Post from "@/app/schemas/postSchema"

export async function POST(req: Request) {
    const values = await req.json()

    if (!values) {
        return new Response("Values received are empty", { status: 400 })
    }

    console.log("Values received from request: ", values);
    

    await connectToDB()

    try {
        await Post.create({
            postTitle: values.postTitle,
            audience: values.audience,
            content: values.content,
            tags: values.tags,
            readability: values.readability,
            tone: values.tone,
        });

        console.log("✅ Post saved successfully");
        return new Response("Post saved successfully", { status: 201 });
    } catch (err) {
        console.log("❌ Error in saving post to DB:", err);
        return new Response("Failed to save post", { status: 500 });
    }
}