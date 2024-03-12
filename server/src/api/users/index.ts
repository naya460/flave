import { apiRoute } from "lib/fastify";
import { getUserList } from "mongo/user/get_list";
import { flvCreateUserHandler, flvCreateUserSchema } from "./create_user";
import { getSession } from "mongo/session/get_session";
import { checkAdminUser } from "mongo/user/check_admin";

export const flvUserRoute: apiRoute = (server, opt, done) => {
  // get user list
  server.get("/", async (req, res) => {
    const session = req.cookies.session;
    if (session === undefined) {
      res.status(400);
      return;
    }

    const user_id = (await getSession(session)).user_id;
    const is_admin = await checkAdminUser(user_id);

    if (is_admin === false) {
      res.status(400);
      return;
    }

    res.type("application/json");
    return await getUserList();
  });

  // create user
  server.post("/", { schema: flvCreateUserSchema }, flvCreateUserHandler);

  done();
};
