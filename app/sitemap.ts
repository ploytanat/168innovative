import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://168innovative.co.th',
      lastModified: new Date(),
    },
    {
      url: 'https://168innovative.co.th/about',
      lastModified: new Date(),
    },
    {
      url: 'https://168innovative.co.th/products',
      lastModified: new Date(),
    },
  ]
}