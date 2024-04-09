import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { getPageList } from "mongo/page/get_list";

const paramsSchema = {
  type: "object",
  properties: {
    workspace_id: { type: "string" },
  },
  required: ["workspace_id"],
} as const;

export const flvGetWorkspacePageListSchema = {
  params: paramsSchema,
};

export const flvGetWorkspacePageListHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
}> = async (req, res) => {
  const auth = await checkAuth("auth", req, res);
  if (auth === null) return;

  res.status(200);
  res.type("application/json");
  return await getPageList(req.params.workspace_id);
};
