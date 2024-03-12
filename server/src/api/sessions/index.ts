import { apiRoute } from "lib/fastify";
import {
  flvCreateSessionHandler,
  flvCreateSessionSchema,
} from "./create_session";
import { flvGetSessionListHandler } from "./get_list";

export const flvSessionRoute: apiRoute = (server, opt, done) => {
  //get session list
  server.get("/", flvGetSessionListHandler);

  // create session
  server.post("/", { schema: flvCreateSessionSchema }, flvCreateSessionHandler);

  done();
};
