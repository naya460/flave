import { apiRoute } from "lib/fastify";
import {
  flvCreateSessionHandler,
  flvCreateSessionSchema,
} from "./create_session";
import { flvGetSessionListHandler } from "./get_list";
import { flvIsSessionValidHandler } from "./is_valid";

export const flvSessionRoute: apiRoute = (server, opt, done) => {
  //get session list
  server.get("/", flvGetSessionListHandler);

  // create session
  server.post("/", { schema: flvCreateSessionSchema }, flvCreateSessionHandler);

  // check session validity
  server.get("/is_valid", flvIsSessionValidHandler);

  done();
};
