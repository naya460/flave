import { apiRoute } from "lib/fastify";
import { getUserList } from "mongo/user/get_list";
import { flvCreateUserHandler, flvCreateUserSchema } from "./create_user";

export const flvUserRoute: apiRoute = (server, opt, done) => {
  // get user list
  server.get("/", async (req, res) => {
    res.type("application/json");
    return await getUserList();
  });

  // create user
  server.post("/", { schema: flvCreateUserSchema }, flvCreateUserHandler);

  done();
};
