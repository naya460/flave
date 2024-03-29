import {
  FastifyInstance,
  FastifyPluginOptions,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteGenericInterface,
  RouteHandlerMethod,
} from "fastify";

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
