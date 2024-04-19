import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { createPage } from "mongo/page/create";

const bodySchema = {
  type: "object",
  properties: {
    workspace_id: { type: "string" },
    parent: { type: "string" },
  },
  required: ["workspace_id"],
} as const;

export const flvCreatePageSchema = {
  body: bodySchema,
};

export const flvCreatePageHandler: apiHandler<{
  Body: FromSchema<typeof bodySchema>;
}> = async (req, res) => {
  const auth = await checkAuth("auth", req, res);
  if (auth === null) return;

  res.status(200);
  res.type("application/json");
  return await createPage(req.body.workspace_id, auth, req.body.parent);
};
