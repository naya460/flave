import { apiRoute } from "lib/api_route";
import { mongoClient } from "lib/mongo";

export const flvUserRoute: apiRoute = (server, opt, done) => {
  // get user list
  server.get("/", async (_, res) => {
    res.type("application/json");
    return await mongoClient.db("flave").collection("user").find({}).toArray();
  });

  // create user
  server.post<{
    Body: {
      name: "string";
    };
  }>("/", async (req, res) => {
    const name = req.body.name;
    if (!name) return;
    mongoClient.db("flave").collection("user").insertOne({ name });
    res.status(200);
  });

  done();
};
