import { apiRoute } from "lib/fastify";
import { flvGetRdbDataHandler, flvGetRdbDataSchema } from "./get_data";
import { flvPatchRdbDataHandler, flvPatchRdbDataSchema } from "./patch_data";
import {
  flvGetRdbPageListHandler,
  flvGetRdbPageListSchema,
} from "./get_page_list";
import {
  flvCreateRdbPropertyHandler,
  flvCreateRdbPropertySchema,
} from "./create_property";
import {
  flvPatchRdbPropertyHandler,
  flvPatchRdbPropertySchema,
} from "./patch_property";

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

  // create property
  server.post(
    "/:rdb_id/property",
    { schema: flvCreateRdbPropertySchema },
    flvCreateRdbPropertyHandler
  );

  // patch property
  server.patch(
    "/:rdb_id/property/:property_id",
    { schema: flvPatchRdbPropertySchema },
    flvPatchRdbPropertyHandler
  );

  done();
};
