import { Product } from "models/product";

export async function getProducts(
  search: string,
  limit: number,
  offset: number
): Promise<any> {
  const results = await Product.getProducts(search, limit, offset);

  return {
    results: results.hits,
    pagination: {
      offset,
      limit,
      total: results.nbHits,
    },
  };
}

export async function getProductObjectId(id: string): Promise<any> {
  return await Product.getProductById(id);
}
