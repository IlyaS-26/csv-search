import { createWriteStream, createReadStream } from "node:fs";
import { runMigrations, pool } from "../db/migrate.js";
import { fileURLToPath } from 'node:url';
import { pipeline } from "node:stream/promises";
import { parse } from "csv-parse";
import fastify from "fastify";
import multipart from "@fastify/multipart";
import path from "node:path";
import "dotenv/config";

runMigrations();

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

    const dirname = path.dirname(fileURLToPath(import.meta.url));
    const destination = path.join(dirname, "uploads", "data.csv");

    await pipeline(file.file, createWriteStream(destination));

    const parser = parse({
        toLine: 1
    });

    let columns: string[] = [];

    parser.on("readable", () => {
        columns = parser.read();
    });

    createReadStream(destination).pipe(parser);

    await pool.query("DROP TABLE IF EXISTS app.dataset");
    await pool.query("CREATE TABLE app.dataset");

    return reply.code(201).send("File successfully upload");
});

await app.listen({
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || "0.0.0.0"
});
