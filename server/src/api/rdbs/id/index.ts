import { apiRoute } from "lib/fastify";
import { flvGetRdbDataHandler, flvGetRdbDataSchema } from "./get_data";
import { flvPatchRdbDataHandler, flvPatchRdbDataSchema } from "./patch_data";

export const flvRdbIdRoute: apiRoute = (server, opt, done) => {
  // get rdb data
  server.get("/:rdb_id", { schema: flvGetRdbDataSchema }, flvGetRdbDataHandler);

  // patch rdb data
  server.patch(
    "/:rdb_id",
    { schema: flvPatchRdbDataSchema },
    flvPatchRdbDataHandler
  );

  done();
};
