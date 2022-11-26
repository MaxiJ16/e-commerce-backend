import type { NextApiRequest, NextApiResponse } from "next";
import { airtableBase } from "lib/airtable";
import { productsIndex } from "lib/algolia";

export default function (req: NextApiRequest, res: NextApiResponse) {
  airtableBase("Furniture")
    .select({
      pageSize: 10,
    })
    .eachPage(
      async function (records, fetchNextPage) {
        const objects = records.map((r) => {
          return {
            objectID: r.id,
            ...r.fields,
          };
        });

        await productsIndex.saveObjects(objects);
        // De esta forma le decimos trae la página que sigue
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
        console.log("termino");
      }
    );
}
