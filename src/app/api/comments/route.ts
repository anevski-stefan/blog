import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await request.json()
    const { postId, content, replyToId } = json

    if (!postId || !content) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Get the post to verify it exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return new NextResponse("Post not found", { status: 404 })
    }

    // If this is a reply, verify the parent comment exists
    if (replyToId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: replyToId },
      })

      if (!parentComment) {
        return new NextResponse("Parent comment not found", { status: 404 })
      }
    }

    const authorName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Anonymous'

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
        authorName,
        replyToId,
        // Auto-approve comments for now. In production, you might want to moderate them
        isApproved: true,
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error("Failed to create comment:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 