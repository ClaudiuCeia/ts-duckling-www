/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

export default function Navbar() {
  return (
    <nav class={tw`bg-gray-800`}>
      <div class={tw`max-w-7xl mx-auto px-2 sm:px-6 lg:px-8`}>
        <div class={tw`relative flex items-center justify-between h-16`}>
          <div
            class={tw`flex-1 flex items-center justify-center sm:items-stretch sm:justify-start`}
          >
            <div class={tw`flex-shrink-0 flex items-center`}>
              <img
                class={tw`hidden lg:block h-8 w-auto`}
                src="/logo.svg"
                alt="ts-duckling"
              />
              <h1 class={tw`text-white px-3 py-2`}>ts-duckling v0.0.4</h1>
            </div>
          </div>

          <div
            class={tw`absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0`}
          >
            <a
              type="button"
              class={tw`bg-gray-800 p-2 px-5 rounded-full text-gray-400 hover:text-white text-3xl`}
              href="https://github.com/ClaudiuCeia/ts-duckling"
              target="_blank"
            >
              <i class={tw`fa-brands fa-github pr-3`}></i>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
