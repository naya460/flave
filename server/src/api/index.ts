import { apiRoute } from "lib/fastify";
import { flvUserRoute } from "./users";
import { flvSessionRoute } from "./sessions";
import { flvWorkspaceRoute } from "./workspaces";
import { flvPageRoute } from "./pages";

export const flvApiRoute: apiRoute = (server, opt, done) => {
  server.register(flvUserRoute, { prefix: "/users" });

  server.register(flvSessionRoute, { prefix: "/sessions" });

  server.register(flvWorkspaceRoute, { prefix: "/workspaces" });

  server.register(flvPageRoute, { prefix: "/pages" });

  done();
};
