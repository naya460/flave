import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { deletePage } from "mongo/page/delete";
import { ObjectId } from "mongodb";

const paramsSchema = {
  type: "object",
  properties: {
    page_id: { type: "string" },
  },
  required: ["page_id"],
} as const;

export const flvDeletePageSchema = {
  params: paramsSchema,
};

export const flvDeletePageHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ page: req.params.page_id }, req, res);
  if (auth === null) return null;

  await deletePage(new ObjectId(req.params.page_id), auth);

  res.status(200);
};
