import { apiRoute } from "lib/fastify";
import { flvGetRdbDataHandler, flvGetRdbDataSchema } from "./get_data";

export const flvRdbIdRoute: apiRoute = (server, opt, done) => {
  // get rdb data
  server.get("/:rdb_id", { schema: flvGetRdbDataSchema }, flvGetRdbDataHandler);

  done();
};
