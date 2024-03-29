import { apiHandler } from "lib/fastify";
import { checkAuth } from "api/common/check_auth";
import { getWorkspaceList } from "mongo/workspaces/get_list";

export const flvGetWorkspaceListHandler: apiHandler<{
  Reply: undefined;
}> = async (req, res) => {
  const auth = await checkAuth("admin", req, res);
  if (auth === null) return;

  res.type("application/json");
  return await getWorkspaceList();
};
