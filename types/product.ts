import type { Category } from "./category";
import type { SEO } from "./seo";

export interface Product{
    id:number;
    slug: string;
    title: string;
    content: string;
    excerpt?:string;
    featured_image:string;
    gallery?:string[];
    category:Category;
    seo:SEO;
}