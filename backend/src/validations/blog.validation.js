const z = require('zod');

const createBlogInput = z.object({
    title: z.string().trim().min(3).max(150),
    content: z.string().min(20),
    coverImage: z.string().url().optional(),
    category: z.string().trim(),
    tags: z.array(z.string()).optional()
})

const updateBlogInput = z.object({
    title: z.string().min(3).max(150).optional(),
    content: z.string().min(20).optional(),
    coverImage: z.string().url().optional(),
    category: z.string().trim().optional(),
    tags: z.array(z.string()).optional()
})

const createCommentInput = z.object({
    comment: z.string().min(3).trim()
})

const updateCommentInput = z.object({
    comment: z.string().min(3).trim()
})

module.exports = {
    createBlogInput,
    updateBlogInput,
    createCommentInput,
    updateCommentInput
};