import { FastifyInstance, FastifyPluginOptions } from "fastify";

export type apiRoute = (
  server: FastifyInstance,
  opt: FastifyPluginOptions,
  done: (err?: Error) => void
) => void;
