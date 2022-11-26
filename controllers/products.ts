import { Product } from "models/product";

export async function getProducts(
  search: string,
  limit: number,
  offset: number
): Promise<any> {
  try {
    const results = await Product.getProducts(search, limit, offset);

    return {
      results: results.hits,
      pagination: {
        offset,
        limit,
        total: results.nbHits,
      },
    };
  } catch (error) {
    return error;
  }
}

export async function getAllProducts() {
  try {
    const results = await Product.getAllProducts();
    return {
      results: results.hits,
      pagination: {
        total: results.nbHits,
      },
    };
  } catch (error) {
    return error;
  }
}

export async function getProductObjectId(id: string): Promise<any> {
  return await Product.getProductById(id);
}
