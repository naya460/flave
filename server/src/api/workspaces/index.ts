import { apiRoute } from "lib/fastify";
import {
  flvCreateWorkspaceHandler,
  flvCreateWorkspaceSchema,
} from "./create_workspace";
import { flvGetWorkspaceListHandler } from "./get_list";
import { flvWorkspaceIdRoute } from "./id";

export const flvWorkspaceRoute: apiRoute = (server, opt, done) => {
  // get workspace list
  server.get("/", flvGetWorkspaceListHandler);

  // create workspace
  server.post(
    "/",
    { schema: flvCreateWorkspaceSchema },
    flvCreateWorkspaceHandler
  );

  // routes with workspace id
  server.register(flvWorkspaceIdRoute);

  done();
};
