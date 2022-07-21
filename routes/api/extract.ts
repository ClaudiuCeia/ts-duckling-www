import { Handlers } from "$fresh/server.ts";
import {
  Duckling,
  Email,
  Institution,
  Quantity,
  Temperature,
  Time,
  Range,
  URL as URLRecognizer,
  Location,
} from "https://deno.land/x/duckling@v0.0.4/mod.ts";

export const handler: Handlers = {
  GET(req) {
    const query = new URL(req.url).searchParams.get("q");

    const res = Duckling([
      Range.parser,
      Temperature.parser,
      Time.parser,
      Quantity.parser,
      Email.parser,
      Institution.parser,
      URLRecognizer.parser,
      Location.parser,
    ]).extract({ text: query || "", index: 0 });

    const list = res.success
      ? JSON.stringify(res.value.filter((e) => !!e))
      : [];

    return new Response(JSON.stringify(list), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
