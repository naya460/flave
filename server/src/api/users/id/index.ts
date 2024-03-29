import { apiRoute } from "lib/fastify";
import { flvGetUserDataHandler, flvGetUserDataSchema } from "./get_user_data";
import {
  flvGetUserWorkspaceListHandler,
  flvGetUserWorkspaceListSchema,
} from "./get_workspace_list";

export const flvUserIdRoute: apiRoute = (server, opt, done) => {
  // get user data
  server.get(
    "/:user_id",
    { schema: flvGetUserDataSchema },
    flvGetUserDataHandler
  );

  server.get(
    "/:user_id/workspaces",
    { schema: flvGetUserWorkspaceListSchema },
    flvGetUserWorkspaceListHandler
  );

  done();
};
