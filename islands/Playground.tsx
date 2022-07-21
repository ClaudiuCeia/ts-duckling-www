/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import {
  AnyEntity,
  Duckling,
} from "https://deno.land/x/duckling@v0.0.2/mod.ts";
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
      if (
        selectedEntity &&
        selectedEntity.start === part.start &&
        selectedEntity.end === part.end
      ) {
        setSelectedEntity(undefined);
      } else {
        setSelectedEntity(part);
      }
    };
  };

  return (
    <div>
      <div class={tw`grid grid-cols-2 gap-4 mt-10`}>
        <textarea
          onInput={extractEntities}
          class={tw`w-full h-52 rounded-lg p-6 border(gray-700 1) bg(gray-900) placeholder(italic text-slate-400)`}
          placeholder="Type in the text you want to parse."
        ></textarea>

        <div
          class={tw`w-full max-h-52 rounded-lg p-6 shadow-0 border(gray-700 1) overflow-auto`}
        >
          {displayEntities().map((part, idx) => {
            if (typeof part === "string") {
              return <span>{part}</span>;
            }

            const bg =
              selectedEntity &&
              selectedEntity.start === part.start &&
              selectedEntity.end === part.end
                ? `bg-red-600`
                : `bg-blue-300`;

            return (
              <span
                class={tw`${bg} px-1 py rounded font-bold text-black cursor-pointer`}
                onClick={showEntity(part)}
                title={JSON.stringify(part.value)}
              >
                {part.text}
              </span>
            );
          })}
        </div>
      </div>

      {selectedEntity && (
        <div
          autoFocus={true}
          tabIndex={0}
          onBlur={() => setSelectedEntity(undefined)}
          class={tw`max-h-72 overflow-auto p-6 border(gray-300 1) mt-10 rounded-lg`}
        >
          <pre>{JSON.stringify(selectedEntity, undefined, 2)}</pre>
        </div>
      )}
    </div>
  );
}
