import fastify from "fastify";
import cors from "@fastify/cors";
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://root:password@mongo:27017/");
client.connect().then(console.log).catch(console.error);

const server = fastify();
server.register(cors, { origin: true });

server.get("/test", async () => {
  return await client.db("test").collection("fuwah").find({}).toArray();
});

server.listen({ host: "0.0.0.0", port: 8080 });
