import { apiRoute } from "lib/fastify";
import {
  flvPatchBlockDataHandler,
  flvPatchBlockDataSchema,
} from "./patch_data";
import { flvGetBlockDataHandler, flvGetBlockDataSchema } from "./get_data";
import { flvDeleteBlockHandler, flvDeleteBlockSchema } from "./delete";

export const flvBlockIdRoute: apiRoute = (server, opt, done) => {
  // get block data
  server.get(
    "/:block_id",
    { schema: flvGetBlockDataSchema },
    flvGetBlockDataHandler
  );

  // patch block data
  server.patch(
    "/:block_id",
    { schema: flvPatchBlockDataSchema },
    flvPatchBlockDataHandler
  );

  // delete block
  server.delete(
    "/:block_id",
    { schema: flvDeleteBlockSchema },
    flvDeleteBlockHandler
  );

  done();
};
