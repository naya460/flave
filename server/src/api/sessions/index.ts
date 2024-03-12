import { apiRoute } from "lib/fastify";
import {
  flvCreateSessionHandler,
  flvCreateSessionSchema,
} from "./create_session";

export const flvSessionRoute: apiRoute = (server, opt, done) => {
  // create session
  server.post("/", { schema: flvCreateSessionSchema }, flvCreateSessionHandler);

  done();
};
