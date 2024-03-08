import fastify from "fastify";
import cors from "@fastify/cors";
import { flvApiRoute } from "api";

const server = fastify();
server.register(cors, { origin: true });

server.register(flvApiRoute);

server.listen({ host: "0.0.0.0", port: 8080 });
