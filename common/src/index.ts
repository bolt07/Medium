import z from "zod";

export const singupInput = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional()
})



export const singninInput = z.object({
    username: z.string().email(),
    password: z.string().min(6),
})



export const createBlog = z.object({
    title: z.string(),
    content: z.string(),
})


export const updateBlog = z.object({
    title: z.string(),
    content: z.string(),
})


export type SignupInput = z.infer<typeof singupInput>
export type SigninInput = z.infer<typeof singninInput>
export type CreateBlogInput = z.infer<typeof createBlog>
export type UpdateBlogInput = z.infer<typeof updateBlog>