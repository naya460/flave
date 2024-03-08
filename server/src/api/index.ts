import { apiRoute } from "lib/api_route";
import { mongoClient } from "lib/mongo";

export const flvApiRoute: apiRoute = (server, opt, done) => {
  server.get("/flave", async (_, res) => {
    res.type("application/json");
    return await mongoClient.db("flave").collection("user").find({}).toArray();
  });

  server.post<{
    Body: {
      name: "string";
    };
  }>("/flave/user/add", async (req, res) => {
    const name = req.body.name;
    if (!name) return;
    mongoClient.db("flave").collection("user").insertOne({ name });
    res.status(200);
  });

  done();
};
