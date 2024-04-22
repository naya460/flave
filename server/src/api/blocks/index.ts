import { apiRoute } from "lib/fastify";
import { flvCreateBlockHandler, flvCreateBlockSchema } from "./create";

export const flvBlockRoute: apiRoute = (server, opt, done) => {
  // create page
  server.post("/", { schema: flvCreateBlockSchema }, flvCreateBlockHandler);

  done();
};
