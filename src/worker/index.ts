import { Hono } from "hono";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
const app = new Hono<{ Bindings: Env }>();

app.use(logger());
app.use(secureHeaders());

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

export default app;
