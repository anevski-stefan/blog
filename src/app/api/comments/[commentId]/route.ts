import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 })
    }

    // Only allow the comment author to delete their comment
    if (comment.authorId !== userId) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    // Delete the comment and all its replies
    await prisma.comment.deleteMany({
      where: {
        OR: [
          { id: commentId },
          { replyToId: commentId },
        ],
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Failed to delete comment:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 