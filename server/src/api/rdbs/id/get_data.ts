import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { getRdbData } from "mongo/rdb/get_data";
import { ObjectId } from "mongodb";

const paramsSchema = {
  type: "object",
  properties: {
    rdb_id: { type: "string" },
  },
  required: ["rdb_id"],
} as const;

export const flvGetRdbDataSchema = {
  params: paramsSchema,
};

export const flvGetRdbDataHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ rdb: req.params.rdb_id }, req, res);
  if (auth === null) return null;

  const result = await getRdbData(new ObjectId(req.params.rdb_id));

  if (result === null) {
    res.status(400);
    return;
  }

  res.status(200);
  res.type("application/json");
  return result;
};
