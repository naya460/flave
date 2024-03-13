import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteGenericInterface,
  RouteHandlerMethod,
} from "fastify";
import { getSession } from "mongo/session/get_session";
import { checkAdminUser } from "mongo/user/check_admin";

export type apiRoute = (
  server: FastifyInstance,
  opt: FastifyPluginOptions,
  done: (err?: Error) => void
) => void;

export type apiHandler<Generic extends RouteGenericInterface> =
  RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    Generic
  >;

type Auth = "auth" | "admin";

export const checkAuth = async (
  type: Auth,
  req: FastifyRequest,
  res: FastifyReply
) => {
  const session = req.cookies.session;
  if (session === undefined) {
    res.status(400);
    return null;
  }

  const user_id = (await getSession(session)).user_id;

  if (type === "admin") {
    const is_admin = await checkAdminUser(user_id);

    if (is_admin === false) {
      res.status(400);
      return null;
    }
  }

  return user_id;
};
