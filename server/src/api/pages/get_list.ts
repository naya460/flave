import { checkAuth } from "api/common/check_auth";
import { apiHandler } from "lib/fastify";
import { getPageList } from "mongo/page/get_list";

export const flvGetPageList: apiHandler<{
  Body: unknown;
}> = async (req, res) => {
  const auth = await checkAuth("auth", req, res);
  if (auth === null) return;

  res.status(200);
  res.type("application/json");
  return await getPageList();
};
