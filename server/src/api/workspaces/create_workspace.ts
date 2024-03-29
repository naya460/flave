import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { checkAuth } from "api/common/check_auth";
import { createWorkspace } from "mongo/workspaces/create_workspace";

const bodySchema = {
  type: "object",
  properties: {
    name: { type: "string" },
  },
  required: ["name"],
} as const;

export const flvCreateWorkspaceSchema = {
  body: bodySchema,
};

export const flvCreateWorkspaceHandler: apiHandler<{
  Body: FromSchema<typeof bodySchema>;
}> = async (req, res) => {
  const auth = await checkAuth("auth", req, res);
  if (auth === null) return;

  const id = await createWorkspace(req.body.name, auth);
  if (id === null) {
    res.status(400);
    return;
  }

  res.status(200);
  return id;
};
