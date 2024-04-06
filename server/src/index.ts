import fastify from "fastify";
import cors from "@fastify/cors";
import { flvApiRoute } from "api";
import fastifyCookie from "@fastify/cookie";

const server = fastify();
server.register(cors, {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
});

server.register(fastifyCookie);

server.register(flvApiRoute);

server.listen({ host: "0.0.0.0", port: 8080 }, (err, address) => {
  if (err === null) {
    console.log(`listen: ${address}`);
  } else {
    console.log(err.message);
  }
});
