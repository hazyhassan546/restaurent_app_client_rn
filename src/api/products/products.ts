import { apiClient } from './../client';
import { Product } from '../../types/product';

export const getProducts = async (skip = 0, take = 20): Promise<Product[]> => {
  const { data } = await apiClient.get('/products', { params: { skip, take } });
  return data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await apiClient.get(`/products/${id}`);
  return data;
};
