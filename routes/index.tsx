/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import Playground from "../islands/Playground.tsx";
import { Head } from "https://deno.land/x/fresh@1.0.1/runtime.ts";
import Navbar from "../components/Navbar.tsx";

export default function Home() {
  return (
    <html>
      <Head>
        <title>ts-duckling playground</title>
        <link rel="icon" type="image/png" href="/logo.png"/>
        <script src="https://kit.fontawesome.com/4ffecce698.js" crossOrigin="anonymous"></script>
        {/* <link rel="stylesheet" href={asset("style.css")} /> */}
      </Head>
      <body class={tw`bg(gray-900) text(gray-400) h-screen`}>
        <Navbar />
        <div class={tw`p-4 mx-auto max-w-screen-lg`}>
          <Playground />
        </div>
      </body>
    </html>
  );
}
