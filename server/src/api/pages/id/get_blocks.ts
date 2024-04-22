import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { getBlockList } from "mongo/block/get_list";
import { ObjectId } from "mongodb";

const paramsSchema = {
  type: "object",
  properties: {
    page_id: { type: "string" },
  },
  required: ["page_id"],
} as const;

export const flvGetPageBlockListSchema = {
  params: paramsSchema,
};

export const flvGetPageBlockListHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ page: req.params.page_id }, req, res);
  if (auth === null) return;

  res.status(200);
  res.type("application/json");
  return await getBlockList(new ObjectId(req.params.page_id));
};
