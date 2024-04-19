import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { getPageData } from "mongo/page/get_data";

const paramsSchema = {
  type: "object",
  properties: {
    page_id: { type: "string" },
  },
  required: ["page_id"],
} as const;

const replySchema = {
  type: ["object", "null"],
  properties: {
    title: { type: "string" },
  },
  required: ["title"],
} as const;

export const flvGetPageDataSchema = {
  params: paramsSchema,
};

export const flvGetPageDataHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
  Reply: FromSchema<typeof replySchema>;
}> = async (req, res) => {
  const auth = await checkAuth("auth", req, res);
  if (auth === null) return null;

  res.status(200);
  res.type("application/json");
  return await getPageData(req.params.page_id);
};
