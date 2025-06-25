import { api } from './api';

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  hasDiscount?: boolean;
  discountPrice?: number;
  category: string;
  deleted_at?: string | null; // usado apenas para leitura (status ativo/inativo)
}

interface ApiResponseProduct {
  product: Product;
  finalPrice?: number; // se precisar desse campo
}

// GET all products (com filtros opcionais)
export const getProducts = async (params?: {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  hasDiscount?: boolean;
}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

// GET por ID
export async function getProductById(id: number): Promise<ApiResponseProduct> {
  const response = await api.get(`/products/${id}`);
  return response.data; // que tem o formato { product: {...}, finalPrice: ... }
}

// POST create product
export const createProduct = async (product: Product) => {
  const response = await api.post('/products', product);
  return response.data;
};

// PUT (atualizar produto)
export const updateProduct = async (id: number, updatedProduct: Product): Promise<Product> => {
  const response = await api.patch(`/products/${id}`, updatedProduct);
  return response.data;
};

// DELETE product
export const deleteProduct = async (productId: number) => {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};


// PATCH apply coupon to a product
export const applyCoupon = async (productId: number, couponCode: string) => {
  const response = await api.patch(`/products/${productId}/apply-coupon`, {
    couponCode,
  });
  return response.data;
};

// PATCH remove discount
export const removeDiscount = async (productId: number) => {
  const response = await api.patch(`/products/${productId}/remove-discount`);
  return response.data;
};