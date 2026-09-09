import Fastify from "fastify";

export function buildSystemApi() {
  const app = Fastify({ logger: true });

  app.get("/health", async () => ({ status: "ok", service: "system-api" }));

  return app;
}
