"use server"

import {
  createPost as createPostImpl,
  updatePost as updatePostImpl,
} from "@/actions/blog"

export async function createPost(formData: FormData) {
  return createPostImpl(formData)
}

export async function updatePost(formData: FormData) {
  return updatePostImpl(formData)
}
