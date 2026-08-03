import { createAtpClientMetadata } from "./create-atp-client-metadata.ts";

export default {
  fetch(request) {
    const url = new URL(request.url);

    if (url.pathname == "/atp-client-metadata.json") {
      return Response.json(createAtpClientMetadata(request));
    }

    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
