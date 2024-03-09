import { apiRoute } from "lib/api_route";
import { createUser } from "mongo/user/create_user";
import { getUserList } from "mongo/user/get_list";

export const flvUserRoute: apiRoute = (server, opt, done) => {
  // get user list
  server.get("/", async (req, res) => {
    res.type("application/json");
    return await getUserList();
  });

  // create user
  server.post<{
    Body: {
      name: "string";
    };
  }>("/", async (req, res) => {
    const name = req.body.name;
    if (!name) return;
    await createUser(name, name);
    res.status(200);
  });

  done();
};
