import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { getPageList } from "mongo/page/get_list";
import { ObjectId } from "mongodb";

const paramsSchema = {
  type: "object",
  properties: {
    rdb_id: { type: "string" },
  },
  required: ["rdb_id"],
} as const;

export const flvGetRdbPageListSchema = {
  params: paramsSchema,
};

export const flvGetRdbPageListHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ rdb: req.params.rdb_id }, req, res);
  if (auth === null) return;

  res.status(200);
  res.type("application/json");
  return await getPageList({ rdb_id: new ObjectId(req.params.rdb_id) });
};
