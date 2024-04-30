import { apiRoute } from "lib/fastify";
import { flvGetRdbDataHandler, flvGetRdbDataSchema } from "./get_data";
import { flvPatchRdbDataHandler, flvPatchRdbDataSchema } from "./patch_data";
import {
  flvGetRdbPageListHandler,
  flvGetRdbPageListSchema,
} from "./get_page_list";

export const flvRdbIdRoute: apiRoute = (server, opt, done) => {
  // get rdb data
  server.get("/:rdb_id", { schema: flvGetRdbDataSchema }, flvGetRdbDataHandler);

  // patch rdb data
  server.patch(
    "/:rdb_id",
    { schema: flvPatchRdbDataSchema },
    flvPatchRdbDataHandler
  );

  // get page list
  server.get(
    "/:rdb_id/pages",
    { schema: flvGetRdbPageListSchema },
    flvGetRdbPageListHandler
  );

  done();
};
