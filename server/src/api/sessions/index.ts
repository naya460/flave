import { apiRoute } from "lib/fastify";
import {
  flvCreateSessionHandler,
  flvCreateSessionSchema,
} from "./create_session";
import { flvGetSessionListHandler } from "./get_list";
import { flvIsSessionValidHandler } from "./is_valid";
import { flvDeleteSessionHandler } from "./delete_session";

export const flvSessionRoute: apiRoute = (server, opt, done) => {
  //get session list
  server.get("/", flvGetSessionListHandler);

  // create session
  server.post("/", { schema: flvCreateSessionSchema }, flvCreateSessionHandler);

  // delete session
  server.delete("/", flvDeleteSessionHandler);

  // check session validity
  server.get("/is_valid", flvIsSessionValidHandler);

  done();
};
