import { apiRoute } from "lib/fastify";
import { flvCreateUserHandler, flvCreateUserSchema } from "./create_user";
import { flvGetUserListHandler } from "./get_list";
import { flvGetUserDataHandler, flvGetUserDataSchema } from "./_id";

export const flvUserRoute: apiRoute = (server, opt, done) => {
  // get user list
  server.get("/", flvGetUserListHandler);

  // create user
  server.post("/", { schema: flvCreateUserSchema }, flvCreateUserHandler);

  // get user data
  server.get(
    "/:user_id",
    { schema: flvGetUserDataSchema },
    flvGetUserDataHandler
  );

  done();
};
