import { Product } from "../types/content"
let products: Product[] = []

export async function getAdminProducts(): Promise<Product[]> {
  return products
}

export async function createProduct(data: Product) {
  products.push(data)
}

export async function updateProduct(id: string, data: Partial<Product>) {
  products = products.map(p =>
    p.id === id ? { ...p, ...data } : p
  )
}

export async function deleteProduct(id: string) {
  products = products.filter(p => p.id !== id)
}
