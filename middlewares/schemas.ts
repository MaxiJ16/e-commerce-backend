import type { NextApiRequest, NextApiResponse } from "next";

export function validateQuery(schema, callback) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      await schema.validate(req.query);

      callback(req, res);
    } catch (error) {
      res.status(400).json({ field: "query", message: error });
    }
  };
}

export function validateBody(schema, callback) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      await schema.validate(req.body);

      callback(req, res);
    } catch (error) {
      res.status(400).json({ field: "body", message: error });
    }
  };
}
