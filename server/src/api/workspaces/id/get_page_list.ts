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

const querySchema = {
  type: "object",
  properties: {
    deleted: { type: "boolean" },
  },
} as const;

export const flvGetWorkspacePageListSchema = {
  params: paramsSchema,
  query: querySchema,
};

export const flvGetWorkspacePageListHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
  Querystring: FromSchema<typeof querySchema>;
}> = async (req, res) => {
  const auth = await checkAuth(
    { workspace: req.params.workspace_id },
    req,
    res
  );
  if (auth === null) return;

  res.status(200);
  res.type("application/json");
  return await getPageList({
    workspace_id: req.params.workspace_id,
    deleted: req.query.deleted,
  });
};
