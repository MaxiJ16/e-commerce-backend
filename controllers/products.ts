import { Product } from "models/product";
import { airtableBase } from "lib/airtable";
import { productsIndex } from "lib/algolia";

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

export async function SyncProducts() {
  try {
    airtableBase("Products")
      .select({
        pageSize: 100,
      })
      .eachPage(
        async function (records, fetchNextPage) {
          const objects = records.map((r) => {
            return {
              objectID: r.id,
              ...r.fields,
            };
          });

          console.log(objects);
          await productsIndex.saveObjects(objects);
          // De esta forma le decimos trae la página que sigue
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
    return true;
  } catch (error) {
    return error;
  }
}
