import { apiRoute } from "lib/fastify";
import { flvCreateRdbHandler, flvCreateRdbSchema } from "./create";

export const flvRdbRoute: apiRoute = (server, opt, done) => {
  // create relational database
  server.post("/", { schema: flvCreateRdbSchema }, flvCreateRdbHandler);

  done();
};
