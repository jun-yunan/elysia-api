import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";

const db = new PrismaClient();

const app = new Elysia()
    .use(cors())
    .use(swagger())
    .decorate("db", db)
    .get("/", () => "Hello Elysia")
    .get("/welcome", () => {
        return {
            message: "Welcome to Elysia",
            status: "success",
        };
    })
    .post(
        "/api/v1/cookies",
        async ({ db, body }) => {
            try {
                if (!body) {
                    return {
                        message: "Body is required",
                        status: "error",
                    };
                }

                const cookies = await db.cookie.create({
                    data: {
                        name: body.name,
                        cookie: body.cookie,
                    },
                });

                return {
                    message: "Cookies created",
                    data: cookies,
                    body: body,
                };
            } catch (error) {
                console.log(error);
                return {
                    message: "Failed to create cookies",
                    status: "error",
                };
            }
        },
        {
            body: t.Object({
                name: t.String(),
                cookie: t.String(),
            }),
        }
    )
    .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
