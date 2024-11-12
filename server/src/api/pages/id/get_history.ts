import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { getPageHistoryList } from "mongo/page_history/get_list";
import { ObjectId } from "mongodb";

const paramsSchema = {
  type: "object",
  properties: {
    page_id: { type: "string" },
  },
  required: ["page_id"],
} as const;

export const flvGetPageHistorySchema = {
  params: paramsSchema,
};

export const flvGetPageHistoryhandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ page: req.params.page_id }, req, res);
  if (auth === null) return null;

  res.type("application/json");
  return await getPageHistoryList(new ObjectId(req.params.page_id));
};
