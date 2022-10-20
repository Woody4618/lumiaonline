import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        {/** Trigger an empty iframe to use audio autoplay later */}
        <iframe
          src="/assets/silence.mp3"
          allow="autoplay"
          id="audio"
          style={{ display: "none" }}
        ></iframe>

        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
