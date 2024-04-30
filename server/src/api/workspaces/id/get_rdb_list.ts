import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { getRdbList } from "mongo/rdb/get_list";
import { ObjectId } from "mongodb";

const paramsSchema = {
  type: "object",
  properties: {
    workspace_id: { type: "string" },
  },
  required: ["workspace_id"],
} as const;

export const flvGetWorkspaceRdbListSchema = {
  params: paramsSchema,
};

export const flvGetWorkspaceRdbListHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
}> = async (req, res) => {
  const auth = await checkAuth(
    { workspace: req.params.workspace_id },
    req,
    res
  );
  if (auth === null) return;

  res.status(200);
  res.type("application/json");
  return await getRdbList(new ObjectId(req.params.workspace_id));
};
