import { z } from 'zod'

export const FormDataSchema = z.object({
  blogTitle: z.string().min(1, 'Blog Titile is required'),
  authorName: z.string().min(1, 'Author Name is required'),
  summary: z.string().min(1, 'Summary is required'),
  category: z.string().min(1, 'Category is required'),
  blogContent: z.string().min(1, 'Blog Content is required'),
})
