import fastify from "fastify";
import multipart from "@fastify/multipart";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";

const app = fastify({
    logger: true
});

await app.register(multipart);

app.post("/uploadCSV", async (request, reply) => {
    const file = await request.file();
    if (!file) return reply.code(400).send({ error: "No file" });

    const dir = path.join("src/service/uploads");
    const destination = path.join(dir, "data.csv");

    await pipeline(file.file, createWriteStream(destination));
    return reply.code(201).send({ mimetype: file.mimetype });
});

await app.listen({
    port: 3000,
    host: "0.0.0.0"
});
