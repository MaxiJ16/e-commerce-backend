import { productsIndex } from "lib/algolia";

export class Product {
  id: string;
  constructor(id) {
    this.id = id;
  }
  static async getProducts(search: string, limit: number, offset: number) {
    const res = await productsIndex.search(search, {
      offset,
      length: limit,
    });
    return res;
  }
  static async getProductById(id: string) {
    try {
      const product = await productsIndex.getObject(id);
      return product;
    } catch (error) {
      throw { Message: `${error.message}` };
    }
  }
}
