import { apiRoute } from "lib/fastify";
import {
  flvCreateWorkspaceHandler,
  flvCreateWorkspaceSchema,
} from "./create_workspace";
import { flvGetWorkspaceListHandler } from "./get_list";

export const flvWorkspaceRoute: apiRoute = (server, opt, done) => {
  // get workspace list
  server.get("/", flvGetWorkspaceListHandler);

  // create workspace
  server.post(
    "/",
    { schema: flvCreateWorkspaceSchema },
    flvCreateWorkspaceHandler
  );

  done();
};
