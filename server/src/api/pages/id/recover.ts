import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { recoverPage } from "mongo/page/recover";
import { ObjectId } from "mongodb";

const paramsSchema = {
  type: "object",
  properties: {
    page_id: { type: "string" },
  },
  required: ["page_id"],
} as const;

export const flvRecoverPageSchema = {
  params: paramsSchema,
};

export const flvRecoverPageHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ page: req.params.page_id }, req, res);
  if (auth === null) return;

  await recoverPage(new ObjectId(req.params.page_id), auth);

  res.status(200);
};
