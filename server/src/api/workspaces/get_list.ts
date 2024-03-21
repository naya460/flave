import { apiHandler, checkAuth } from "lib/fastify";
import { getWorkspaceList } from "mongo/workspaces/get_list";

export const flvGetWorkspaceListHandler: apiHandler<{
  Reply: undefined;
}> = async (req, res) => {
  const auth = await checkAuth("admin", req, res);
  if (auth === null) return;

  res.type("application/json");
  return await getWorkspaceList();
};
