import Fastify from "fastify";
import cors from "@fastify/cors";
import fastify from "fastify";

const server = Fastify();
server.register(cors, { origin: true });

server.get("/test", async (req, res) => {
    return "This is a server!";
});

server.listen({"host": "0.0.0.0", "port": 8080});
