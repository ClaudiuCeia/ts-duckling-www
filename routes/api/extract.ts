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
  AnyEntity,
} from "duckling/mod.ts";

export const handler: Handlers = {
  GET(req) {
    const query = new URL(req.url).searchParams.get("q");
    if (!query) {
      return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json" },
      });
    }

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
      ? (res.value.filter((e) => !!e) as AnyEntity[])
      : [];

    const stitched: (string | AnyEntity)[] = [
      query.substring(0, list[0]?.start),
    ];

    for (const [idx, entity] of list.entries()) {
      const nextEntity = list[idx + 1];
      const followingText = nextEntity
        ? query.substring(entity.end, nextEntity.start)
        : query.substring(entity.end);

      stitched.push(entity, followingText);
    }

    return new Response(JSON.stringify(stitched), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
