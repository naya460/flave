import { apiRoute } from "lib/fastify";
import {
  flvGetWorkspaceDataHandler,
  flvGetWorkspaceDataSchema,
} from "./get_workspace_data";

export const flvWorkspaceIdRoute: apiRoute = (server, opt, done) => {
  // get workspace data
  server.get(
    "/:workspace_id",
    { schema: flvGetWorkspaceDataSchema },
    flvGetWorkspaceDataHandler
  );

  done();
};
