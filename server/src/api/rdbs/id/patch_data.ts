import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { updateRdb } from "mongo/rdb/update";
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
    title: { type: "string" },
  },
  required: ["title"],
} as const;

export const flvPatchRdbDataSchema = {
  params: paramsSchema,
  body: bodySchema,
};

export const flvPatchRdbDataHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
  Body: FromSchema<typeof bodySchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ rdb: req.params.rdb_id }, req, res);
  if (auth === null) return null;

  const result = await updateRdb(
    new ObjectId(req.params.rdb_id),
    req.body.title,
    auth
  );

  if (result === false) {
    res.status(400);
    return;
  }

  res.status(200);
};
