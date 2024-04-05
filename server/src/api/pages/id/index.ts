import { apiRoute } from "lib/fastify";
import { flvGetPageDataHandler, flvGetPageDataSchema } from "./get_page_data";

export const flvPageIdRoute: apiRoute = (server, opt, done) => {
  // get page data
  server.get(
    "/:page_id",
    { schema: flvGetPageDataSchema },
    flvGetPageDataHandler
  );

  done();
};
