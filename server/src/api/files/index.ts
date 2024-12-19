import { apiRoute } from "lib/fastify";
import { flvCreateFileHandler, flvCreateFileSchema } from "./create_file";
import { flvFileIdRoute } from "./id";

export const flvFileRoute: apiRoute = (server, opt, done) => {
  // create file
  server.post("/", { schema: flvCreateFileSchema }, flvCreateFileHandler);

  // route with file id
  server.register(flvFileIdRoute);

  done();
};
