import { apiRoute } from "lib/fastify";
import { flvGetPageDataHandler, flvGetPageDataSchema } from "./get_page_data";
import {
  flvPatchPageDataHandler,
  flvPatchPageDataSchema,
} from "./patch_page_data";
import { flvGetPagePathHandler, flvGetPagePathSchema } from "./get_path";
import {
  flvGetPageBlockListHandler,
  flvGetPageBlockListSchema,
} from "./get_blocks";
import {
  flvPatchPagePropertyHandler,
  flvPatchPagePropertySchema,
} from "./patch_property";
import { flvDeletePageHandler, flvDeletePageSchema } from "./delete";

export const flvPageIdRoute: apiRoute = (server, opt, done) => {
  // get page data
  server.get(
    "/:page_id",
    { schema: flvGetPageDataSchema },
    flvGetPageDataHandler
  );

  // patch page data
  server.patch(
    "/:page_id",
    { schema: flvPatchPageDataSchema },
    flvPatchPageDataHandler
  );

  // delete page
  server.delete(
    "/:page_id",
    { schema: flvDeletePageSchema },
    flvDeletePageHandler
  );

  // get page path
  server.get(
    "/:page_id/path",
    { schema: flvGetPagePathSchema },
    flvGetPagePathHandler
  );

  // get page block list
  server.get(
    "/:page_id/blocks",
    { schema: flvGetPageBlockListSchema },
    flvGetPageBlockListHandler
  );

  // patch page property
  server.patch(
    "/:page_id/property/:property_id",
    { schema: flvPatchPagePropertySchema },
    flvPatchPagePropertyHandler
  );

  done();
};
