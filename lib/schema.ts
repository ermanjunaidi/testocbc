import { z } from 'zod'

export const FormDataSchema = z.object({
  blogTitle: z.string().min(1, "Blog Title is required"),
  authorName: z.string().min(1, "Author Name is required"),
  category: z.enum(['Tech', 'Life Style', 'Business'], { required_error: "Category is required" }),
  summary: z.string().min(1, "Summary is required"),
  blogContent: z.string().min(10, "Content must be at least 10 characters long"),
});