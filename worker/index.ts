import { Hono } from "hono";

import { createAtpClientMetadata } from "./create-atp-client-metadata.ts";

const app = new Hono();

app.get("/atp-client-metadata.json", (c) => c.json(createAtpClientMetadata(c.req.raw)));

export default app satisfies ExportedHandler<Env>;
