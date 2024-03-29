import { FastifyReply, FastifyRequest } from "fastify";
import { getSession } from "mongo/sessions/get_session";
import { checkAdminUser } from "mongo/user/check_admin";

type Auth = "auth" | "admin";

export const checkAuth = async (
  type: Auth,
  req: FastifyRequest,
  res?: FastifyReply
) => {
  const session = req.cookies.session;
  if (session === undefined) {
    res?.status(401);
    return null;
  }

  const user_id = (await getSession(session))?.user_id;
  if (user_id === undefined) {
    res?.status(400);
    return null;
  }

  if (type === "admin") {
    const is_admin = await checkAdminUser(user_id);

    if (is_admin === false) {
      res?.status(403);
      return null;
    }
  }

  return user_id;
};
