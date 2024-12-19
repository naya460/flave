import { apiRoute } from "lib/fastify";
import { flvUserRoute } from "./users";
import { flvSessionRoute } from "./sessions";
import { flvWorkspaceRoute } from "./workspaces";
import { flvPageRoute } from "./pages";
import { flvBlockRoute } from "./blocks";
import { flvRdbRoute } from "./rdbs";
import { flvFileRoute } from "./files";

export const flvApiRoute: apiRoute = (server, opt, done) => {
  server.register(flvUserRoute, { prefix: "/users" });

  server.register(flvSessionRoute, { prefix: "/sessions" });

  server.register(flvWorkspaceRoute, { prefix: "/workspaces" });

  server.register(flvPageRoute, { prefix: "/pages" });

  server.register(flvBlockRoute, { prefix: "/blocks" });

  server.register(flvRdbRoute, { prefix: "/rdbs" });

  server.register(flvFileRoute, { prefix: "/files" });

  done();
};
