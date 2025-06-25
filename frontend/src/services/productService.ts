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
  finalPrice?: number;
}

// Busca todos os produtos, com suporte a filtros opcionais (nome, preço, desconto)
export const getProducts = async (params?: {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  hasDiscount?: boolean;
}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

// Busca um produto pelo ID, incluindo preço final (se houver desconto)
export async function getProductById(id: number): Promise<ApiResponseProduct> {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

// Cria um novo produto com os dados fornecidos
export const createProduct = async (product: Product) => {
  const response = await api.post('/products', product);
  return response.data;
};

// Atualiza um produto existente pelo ID
export const updateProduct = async (id: number, updatedProduct: Product): Promise<Product> => {
  const response = await api.patch(`/products/${id}`, updatedProduct);
  return response.data;
};

// Inativa (soft-delete) um produto pelo ID
export const deleteProduct = async (productId: number) => {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};


// Aplica um cupom a um produto
export const applyCoupon = async (productId: number, couponCode: string) => {
  const response = await api.patch(`/products/${productId}/apply-coupon`, {
    couponCode,
  });
  return response.data;
};

// Remove o desconto aplicado de um produto
export const removeDiscount = async (productId: number) => {
  const response = await api.patch(`/products/${productId}/remove-discount`);
  return response.data;
};