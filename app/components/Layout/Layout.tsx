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
/** @jsxImportSource theme-ui */
import Link from "next/link"
import { Button, Flex, Heading, Link as ThemeLink } from "theme-ui"
import Header from "../Header/Header"

export interface ILayoutProps {}

export function Layout({
  children,
  type = "default",
}: {
  children: React.ReactNode
  type?: string
}) {
  return (
    <Flex
      sx={{
        minHeight: "100vh",
        flexDirection: "column",
      }}
    >
      <Header />

      <Flex
        sx={{
          flex: 1,
          flexDirection: "column",

          "@media (min-width: 768px)": {
            flexDirection: "row",
          },
        }}
      >
        {/* <Flex
          aria-label="menu"
          sx={{
            display: "none",

            flexDirection: "column",
            minWidth: "26rem",
            padding: "1.6rem 3.2rem",
            listStyle: "none",
            gap: "1.6rem",
            borderRight: "1px solid",
            borderColor: "background2",

            "@media (min-width: 768px)": {
              display: "flex",
            },
          }}
          role="menu"
        >
          <Heading mb="1.6rem" variant="heading3">
            Community
          </Heading>
          <Flex
            sx={{
              flexDirection: "column",
              gap: ".8rem",
            }}
          >
            <Link href="/characters" passHref>
              <ThemeLink variant="gameButton">Characters</ThemeLink>
            </Link>

            <Link href="/battles" passHref>
              <ThemeLink variant="gameButton">Latest Battles</ThemeLink>
            </Link>

            <Link href="/highscores" passHref>
              <ThemeLink variant="gameButton">Highscores</ThemeLink>
            </Link>
          </Flex>
        </Flex> */}
        <main
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            maxWidth: type === "default" ? "48rem" : "unset",
            margin: "0 auto",
            padding: type === "default" ? "0 1.6rem" : "0",

            "@media (min-width: 64rem)": {
              minWidth: "64rem",
            },
          }}
        >
          <Flex
            sx={{
              flexDirection: "column",
              marginLeft: "0",
              paddingTop: type === "default" ? "4rem" : "0",
              position: "relative",
            }}
          >
            {children}
          </Flex>
        </main>
      </Flex>
    </Flex>
  )
}
