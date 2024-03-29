import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { getWorkspaceList } from "mongo/workspaces/get_list";

const paramsSchema = {
  type: "object",
  properties: {
    user_id: { type: "string" },
  },
  required: ["user_id"],
} as const;

export const flvGetUserWorkspaceListSchema = {
  params: paramsSchema,
};

export const flvGetUserWorkspaceListHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
}> = async (req, res) => {
  const auth = await checkAuth("auth", req, res);
  if (auth === null) return;

  res.status(200);
  res.type("application/json");
  return await getWorkspaceList(auth);
};
