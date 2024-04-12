import { apiRoute } from "lib/fastify";
import { flvCreatePageHandler, flvCreatePageSchema } from "./create_page";
import { flvGetPageList, flvGetPageListSchema } from "./get_list";
import { flvPageIdRoute } from "./id";

export const flvPageRoute: apiRoute = (server, opt, done) => {
  // get page list
  server.get("/", { schema: flvGetPageListSchema }, flvGetPageList);

  // create page
  server.post("/", { schema: flvCreatePageSchema }, flvCreatePageHandler);

  // routes with page id
  server.register(flvPageIdRoute);

  done();
};
