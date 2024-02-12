import fastify from "fastify";
import cors from "@fastify/cors";

const server = fastify();
server.register(cors, { origin: true });

server.get("/test", async () => {
  return "This is a server!";
});

server.listen({ host: "0.0.0.0", port: 8080 });
