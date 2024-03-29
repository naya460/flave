import { apiHandler } from "lib/fastify";
import { checkAuth } from "api/common/check_auth";
import { deleteSession } from "mongo/sessions/delete_session";

export const flvDeleteSessionHandler: apiHandler<{
  Reply: undefined;
}> = async (req, res) => {
  const auth = await checkAuth("auth", req, res);
  if (auth === null) return;

  const session = req.cookies.session;
  if (session === undefined) {
    res.status(400);
    return;
  }

  const result = await deleteSession(session);
  if (result === false) {
    res.status(400);
    return;
  }

  res.clearCookie("session");

  res.status(200);
  return;
};
