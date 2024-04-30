import { apiRoute } from "lib/fastify";
import {
  flvGetWorkspaceDataHandler,
  flvGetWorkspaceDataSchema,
} from "./get_workspace_data";
import {
  flvGetWorkspacePageListHandler,
  flvGetWorkspacePageListSchema,
} from "./get_page_list";
import {
  flvGetWorkspaceRdbListHandler,
  flvGetWorkspaceRdbListSchema,
} from "./get_rdb_list";

export const flvWorkspaceIdRoute: apiRoute = (server, opt, done) => {
  // get workspace data
  server.get(
    "/:workspace_id",
    { schema: flvGetWorkspaceDataSchema },
    flvGetWorkspaceDataHandler
  );

  // get page list
  server.get(
    "/:workspace_id/pages",
    { schema: flvGetWorkspacePageListSchema },
    flvGetWorkspacePageListHandler
  );

  // get relational database list
  server.get(
    "/:workspace_id/rdbs",
    { schema: flvGetWorkspaceRdbListSchema },
    flvGetWorkspaceRdbListHandler
  );

  done();
};
