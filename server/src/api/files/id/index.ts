import { apiRoute } from "lib/fastify";
import { flvGetFileDataSchema, flvGetFileDataHandler } from "./get_data";

export const flvFileIdRoute: apiRoute = (server, opt, done) => {
  // get file data
  server.get(
    "/:file_id",
    { schema: flvGetFileDataSchema },
    flvGetFileDataHandler
  );

  done();
};
