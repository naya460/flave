import { apiRoute } from "lib/fastify";
import { flvUserRoute } from "./users";

export const flvApiRoute: apiRoute = (server, opt, done) => {
  server.register(flvUserRoute, { prefix: "/users" });

  done();
};
