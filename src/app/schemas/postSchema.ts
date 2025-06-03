import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    postTitle: {
        type: String,
        default: ""
    },

    audience: {
        type: String
    },

    content: {
        type: String
    },

    readability: {
        type: String
    },

    tone: {
        type: String
    },

    tags: {
        type: [String],
        default: []
    },

    files: {
        type: [String],
        default: []
    }
}, { timestamps: true })

const Post = mongoose.models.Post || mongoose.model("Post", postSchema)

export default Post