import fastify from "fastify";
import cors from "@fastify/cors";
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://root:password@mongo:27017/");
client.connect().then(console.log).catch(console.error);

const server = fastify();
server.register(cors, { origin: true });

server.get("/flave", async (_, res) => {
  res.type("application/json");
  return await client.db("flave").collection("user").find({}).toArray();
});

server.post<{
  Body: {
    name: "string";
  };
}>("/flave/user/add", async (req, res) => {
  const name = req.body.name;
  if (!name) return;
  client.db("flave").collection("user").insertOne({ name });
  res.status(200);
});

server.listen({ host: "0.0.0.0", port: 8080 });
