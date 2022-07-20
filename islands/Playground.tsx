/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { AnyEntity, Duckling } from "https://deno.land/x/duckling@v0.0.2/mod.ts";
import { useState } from "preact/hooks";

interface PlaygroundProps {
  _a?: string;
}

export default function Playground(props: PlaygroundProps) {
  const [value, setValue] = useState("");
  const [entities, setEntities] = useState<AnyEntity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<AnyEntity>();

  const extractEntities = (ev: Event) => {
    const target = ev.target;
    if (!target || !(target instanceof HTMLTextAreaElement)) {
      return;
    }

    const res = Duckling.extract({ text: target.value, index: 0 });

    setValue(target.value);
    res.success && setEntities(res.value.filter((e) => !!e) as AnyEntity[]);
  };

  const displayEntities = () => {
    if (entities.length === 0) {
      return [value];
    }

    const stitched: (string | AnyEntity)[] = [
      value.substring(0, entities[0]?.start),
    ];
    for (const [idx, entity] of entities.entries()) {
      const nextEntity = entities[idx + 1];
      const followingText = nextEntity
        ? value.substring(entity.end, nextEntity.start)
        : value.substring(entity.end);

      stitched.push(entity, followingText);
    }

    return stitched;
  };

  const showEntity = (part: AnyEntity) => {
    return () => {
      setSelectedEntity(part);
    };
  };

  return (
    <div>
      <div class={tw`grid grid-cols-2 gap-4 mt-10`}>
        <textarea
          onInput={extractEntities}
          class={tw`w-full h-52 rounded-lg p-6 border(gray-300 1)`}
        ></textarea>

        <div class={tw`w-full h-52 rounded-lg p-6 shadow-lg`}>
          {displayEntities().map((part, idx) => {
            if (typeof part === "string") {
              return <span>{part}</span>;
            }

            return (
              <span
                class={tw`bg-blue-700 px-1 py rounded font-bold text-white`}
                onClick={showEntity(part)}
              >
                {part.text}
              </span>
            );
          })}
        </div>
      </div>

      <div
        class={tw`h-72 overflow-auto p-6 border(gray-300 1) mt-10 rounded-lg`}
      >
        <pre>
          {selectedEntity && JSON.stringify(selectedEntity, undefined, 2)}
        </pre>
      </div>
    </div>
  );
}
