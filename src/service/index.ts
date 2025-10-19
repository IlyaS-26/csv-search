import fastify from "fastify";
import multipart from "@fastify/multipart";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import "dotenv/config";

const app = fastify({
    logger: true
});

await app.register(multipart);

app.post("/upload", async (request, reply) => {
    const file = await request.file();

    if (!file) {
        return reply.code(400).send({ error: "No file" });
    }
    if (file.filename.split(".")[1] !== "csv") {
        return reply.code(400).send({ error: "Not a .csv file" });
    }

    const dir = path.join("src/service/uploads");
    const destination = path.join(dir, "data.csv");

    await pipeline(file.file, createWriteStream(destination));
    return reply.code(201).send("File successfully upload");
});

await app.listen({
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || "0.0.0.0"
});
