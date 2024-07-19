import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { updateRdbProperty } from "mongo/rdb/properties/update";
import { ObjectId } from "mongodb";

const paramsSchema = {
  type: "object",
  properties: {
    rdb_id: { type: "string" },
    property_id: { type: "string" },
  },
  required: ["rdb_id", "property_id"],
} as const;

const bodySchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    option: { type: "object" },
  },
  required: [],
} as const;

export const flvPatchRdbPropertySchema = {
  params: paramsSchema,
  body: bodySchema,
};

export const flvPatchRdbPropertyHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
  Body: FromSchema<typeof bodySchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ rdb: req.params.rdb_id }, req, res);
  if (auth === null) return null;

  const data: {
    id: string;
    name?: string;
    option?: object;
  } = {
    id: req.params.property_id,
  };

  if (req.body.name !== undefined) {
    data.name = req.body.name;
  }

  if (req.body.option !== undefined) {
    data.option = req.body.option;
  }

  const result = await updateRdbProperty(
    new ObjectId(req.params.rdb_id),
    auth,
    { property: data }
  );

  if (result === false) {
    res.status(400);
    return;
  }

  res.status(200);
  return;
};
