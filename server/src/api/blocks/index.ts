import { apiRoute } from "lib/fastify";
import { flvCreateBlockHandler, flvCreateBlockSchema } from "./create";
import { flvBlockIdRoute } from "./id";

export const flvBlockRoute: apiRoute = (server, opt, done) => {
  // create page
  server.post("/", { schema: flvCreateBlockSchema }, flvCreateBlockHandler);

  // routes with block id
  server.register(flvBlockIdRoute);

  done();
};
