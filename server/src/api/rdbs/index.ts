import { apiRoute } from "lib/fastify";
import { flvCreateRdbHandler, flvCreateRdbSchema } from "./create";
import { flvRdbIdRoute } from "./id";

export const flvRdbRoute: apiRoute = (server, opt, done) => {
  // create relational database
  server.post("/", { schema: flvCreateRdbSchema }, flvCreateRdbHandler);

  // routes with rdb id
  server.register(flvRdbIdRoute);

  done();
};
