import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { updateRdb } from "mongo/rdb/update";
import { ObjectId } from "mongodb";
import { v4 as uuid_v4 } from "uuid";

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

  const result = await updateRdb(new ObjectId(req.params.rdb_id), auth, {
    properties: {
      id: uuid_v4(),
      type: req.body.type,
      name: req.body.name,
    },
  });

  if (result === false) {
    res.status(400);
    return;
  }

  res.status(200);
  return;
};
