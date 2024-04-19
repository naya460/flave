import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { getWorkspaceData } from "mongo/workspace/get_data";

const paramsSchema = {
  type: "object",
  properties: {
    workspace_id: { type: "string" },
  },
  required: ["workspace_id"],
} as const;

const replySchema = {
  type: ["object", "null"],
  properties: {
    name: { type: "string" },
  },
  required: ["name"],
} as const;

export const flvGetWorkspaceDataSchema = {
  params: paramsSchema,
};

export const flvGetWorkspaceDataHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
  Reply: FromSchema<typeof replySchema>;
}> = async (req, res) => {
  const auth = await checkAuth(
    { workspace: req.params.workspace_id },
    req,
    res
  );
  if (auth === null) return null;

  res.status(200);
  res.type("application/json");
  return await getWorkspaceData(req.params.workspace_id);
};
