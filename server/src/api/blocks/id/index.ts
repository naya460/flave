import { apiRoute } from "lib/fastify";
import { flvPatchBlockDataHandler, flvPatchBlockDataSchema } from "./patch";

export const flvBlockIdRoute: apiRoute = (server, opt, done) => {
  // patch block data
  server.patch(
    "/:block_id",
    { schema: flvPatchBlockDataSchema },
    flvPatchBlockDataHandler
  );

  done();
};
