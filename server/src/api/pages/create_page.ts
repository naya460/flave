import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { createPage } from "mongo/page/create";

const bodySchema = {
  type: "object",
  properties: {
    workspace_id: { type: "string" },
    parent: { type: "string" },
    rdb_id: { type: "string" },
  },
  required: ["workspace_id"],
} as const;

export const flvCreatePageSchema = {
  body: bodySchema,
};

export const flvCreatePageHandler: apiHandler<{
  Body: FromSchema<typeof bodySchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ workspace: req.body.workspace_id }, req, res);
  if (auth === null) return;

  res.status(200);
  res.type("application/json");
  return await createPage({
    workspace_id: req.body.workspace_id,
    user_id: auth,
    parent: req.body.parent,
    rdb_id: req.body.rdb_id,
  });
};
