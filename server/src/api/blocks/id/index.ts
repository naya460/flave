import { apiRoute } from "lib/fastify";
import {
  flvPatchBlockDataHandler,
  flvPatchBlockDataSchema,
} from "./patch_data";
import { flvGetBlockDataHandler, flvGetBlockDataSchema } from "./get_data";
import {
  flvPatchBlockNextHandler,
  flvPatchBlockNextSchema,
} from "./patch_next_of";

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

  // patch block next
  server.patch(
    "/:block_id/next",
    { schema: flvPatchBlockNextSchema },
    flvPatchBlockNextHandler
  );

  done();
};
