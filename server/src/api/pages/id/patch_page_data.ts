import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { updatePage } from "mongo/page/update";

const paramsSchema = {
  type: "object",
  properties: {
    page_id: { type: "string" },
  },
  required: ["page_id"],
} as const;

const bodySchema = {
  type: "object",
  properties: {
    title: { type: "string" },
  },
  required: ["title"],
} as const;

export const flvPatchPageDataSchema = {
  params: paramsSchema,
  body: bodySchema,
};

export const flvPatchPageDataHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
  Body: FromSchema<typeof bodySchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ page: req.params.page_id }, req, res);
  if (auth === null) return null;

  await updatePage(req.params.page_id, req.body.title, auth);

  res.status(200);
};
