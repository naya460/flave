import { apiRoute } from "lib/fastify";
import { flvGetPageDataHandler, flvGetPageDataSchema } from "./get_page_data";
import {
  flvPatchPageDataHandler,
  flvPatchPageDataSchema,
} from "./patch_page_data";
import { flvGetPagePathHandler, flvGetPagePathSchema } from "./get_path";

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

  // get page path
  server.get(
    "/:page_id/path",
    { schema: flvGetPagePathSchema },
    flvGetPagePathHandler
  );

  done();
};
