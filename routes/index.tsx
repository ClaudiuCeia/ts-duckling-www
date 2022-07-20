/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import Playground from "../islands/Playground.tsx";
import { Head } from "https://deno.land/x/fresh@1.0.1/runtime.ts";

export default function Home() {
  return (
    <html>
      <Head>
        <title>ts-duckling playground</title>
        {/* <link rel="stylesheet" href={asset("style.css")} /> */}
      </Head>
      <body class={tw`bg(slate-900) text(slate-400) h-screen`}>
        <div class={tw`p-4 mx-auto max-w-screen-lg`}>
          <h1>ts-duckling playground</h1>
          <Playground />
        </div>
      </body>
    </html>
  );
}
