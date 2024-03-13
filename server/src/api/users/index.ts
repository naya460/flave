import { apiRoute } from "lib/fastify";
import { flvCreateUserHandler, flvCreateUserSchema } from "./create_user";
import { flvGetUserListHandler } from "./get_list";

export const flvUserRoute: apiRoute = (server, opt, done) => {
  // get user list
  server.get("/", flvGetUserListHandler);

  // create user
  server.post("/", { schema: flvCreateUserSchema }, flvCreateUserHandler);

  done();
};
