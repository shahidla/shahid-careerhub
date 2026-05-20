import { getAllBlogs } from '@/lib/blogs'
import type { MetadataRoute } from 'next'

const BASE_URL = 'https://shahid-careerhub.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getAllBlogs()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/resume`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/ai`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/blogs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/certifications`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/patent`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
    { url: `${BASE_URL}/learning`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/chat`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${BASE_URL}/blogs/${blog.slug}`,
    lastModified: new Date(blog.published_at),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages]
}
