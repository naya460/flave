import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { getBlockData } from "mongo/block/get_data";

const paramsSchema = {
  type: "object",
  properties: {
    page_id: { type: "string" },
  },
  required: ["page_id"],
} as const;

export const flvGetBlockDataSchema = {
  params: paramsSchema,
};

export const flvGetBlockDataHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ page: req.params.page_id }, req, res);
  if (auth === null) return null;

  const data = await getBlockData(req.params.page_id);

  if (data === null) {
    res.status(400);
    return;
  }

  res.status(200);
  res.type("application/json");
  return data;
};
