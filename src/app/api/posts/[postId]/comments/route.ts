import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        isApproved: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Failed to fetch comments:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 