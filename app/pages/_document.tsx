/**
  Lumia Online (https://github.com/lumiaonline)
  Copyright (C) 2023 lumiaonline

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
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
