import { checkAuth } from "api/common/check_auth";
import { exists_property } from "flave_types/property_type";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { createRdbProperty } from "mongo/rdb/properties/create";
import { ObjectId } from "mongodb";

const paramsSchema = {
  type: "object",
  properties: {
    rdb_id: { type: "string" },
  },
  required: ["rdb_id"],
} as const;

const bodySchema = {
  type: "object",
  properties: {
    type: { type: "string" },
    name: { type: "string" },
  },
  required: ["type", "name"],
} as const;

export const flvCreateRdbPropertySchema = {
  params: paramsSchema,
  body: bodySchema,
};

export const flvCreateRdbPropertyHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
  Body: FromSchema<typeof bodySchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ rdb: req.params.rdb_id }, req, res);
  if (auth === null) return null;

  if (exists_property(req.body.type) === false) {
    res.status(400);
    return null;
  }

  const result = await createRdbProperty(
    new ObjectId(req.params.rdb_id),
    auth,
    {
      property: {
        type: req.body.type,
        name: req.body.name,
      },
    }
  );

  if (result === null) {
    res.status(400);
    return;
  }

  res.status(200);
  res.type("text/plain");
  return result;
};
