/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import {
  AnyEntity,
  Duckling,
} from "https://deno.land/x/duckling@v0.0.2/mod.ts";
import { useEffect, useRef, useState } from "preact/hooks";
import { Samples } from "../lib/Samples.ts";

interface PlaygroundProps {
  _a?: string;
}

export default function Playground(props: PlaygroundProps) {
  const [value, setValue] = useState("");
  const [entities, setEntities] = useState<AnyEntity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<AnyEntity>();
  const [parseTime, setParseTime] = useState<number>();

  const firstDivRef = useRef(null);
  const secondDivRef = useRef(null);

  const handleScrollFirst = (scroll: Event) => {
    const target = scroll.target;
    // deno-lint-ignore no-explicit-any
    const second = secondDivRef.current as any;
    if (
      !(target instanceof HTMLTextAreaElement) ||
      !(second instanceof HTMLDivElement)
    ) {
      return;
    }
    second.scrollTop = target.scrollTop;
  };

  const handleScrollSecond = (scroll: Event) => {
    const target = scroll.target;
    // deno-lint-ignore no-explicit-any
    const first = firstDivRef.current as any;
    if (
      !(target instanceof HTMLTextAreaElement) ||
      !(first instanceof HTMLDivElement)
    ) {
      return;
    }
    first.scrollTop = target.scrollTop;
  };

  useEffect(() => {
    const n = performance.now();
    const res = Duckling.extract({ text: value, index: 0 });
    setParseTime(performance.now() - n);
    res.success && setEntities(res.value.filter((e) => !!e) as AnyEntity[]);
  }, [value]);

  const onTextareaClick = (ev: Event) => {
    const target = ev.target;
    if (!target || !(target instanceof HTMLTextAreaElement)) {
      return;
    }

    setValue(target.value);
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
      <div>
        {Object.entries(Samples).map(([sampleKey, sampleValue]) => {
          return (
            <a
              href="#"
              onClick={() => setValue(sampleValue.trim())}
              class={tw`text-underline mr-4`}
            >
              {sampleKey.substring(0, 1).toUpperCase()}
              {sampleKey.substring(1)}
            </a>
          );
        })}
      </div>

      {entities.length > 0 && parseTime && (
        <p class={tw`mt-4`}>
          Parsed {entities.length} entities in ~{parseTime}ms (text size:{" "}
          {(new Blob([value]).size / 1024).toFixed(2)} kb)
        </p>
      )}

      <div class={tw`grid grid-cols-2 gap-4 mt-4`}>
        <textarea
          onScroll={handleScrollFirst}
          ref={firstDivRef}
          onInput={onTextareaClick}
          value={value}
          class={tw`w-full h-52 rounded-lg p-6 border(gray-700 1) bg(gray-900) placeholder(italic text-slate-400)`}
          placeholder="Type in the text you want to parse."
        ></textarea>

        <div
          class={tw`w-full max-h-52 rounded-lg p-6 shadow-0 border(gray-700 1) overflow-auto`}
          onScroll={handleScrollSecond}
          ref={secondDivRef}
        >
          {displayEntities().map((part, idx) => {
            if (typeof part === "string") {
              return <span>{part}</span>;
            }

            const isMatchedEntity =
              selectedEntity &&
              selectedEntity.start === part.start &&
              selectedEntity.end === part.end;

            const bg = isMatchedEntity ? `bg-red-600` : `bg-blue-300`;
            const color = isMatchedEntity ? `text-white` : `text-black`;

            return (
              <span
                class={tw`${bg} px-1 py rounded font-bold ${color} cursor-pointer`}
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
          class={tw`w-full max-h-72 overflow-auto p-6 border(gray-300 1) mt-10 rounded-lg`}
        >
          <pre>{JSON.stringify(selectedEntity, undefined, 2)}</pre>
        </div>
      )}
    </div>
  );
}
