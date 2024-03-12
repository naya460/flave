import { apiRoute } from "lib/fastify";
import { flvUserRoute } from "./users";
import { flvSessionRoute } from "./sessions";

export const flvApiRoute: apiRoute = (server, opt, done) => {
  server.register(flvUserRoute, { prefix: "/users" });

  server.register(flvSessionRoute, { prefix: "/sessions" });

  done();
};
