/** @jsxImportSource theme-ui */
import Link from "next/link"
import * as React from "react"
import { Flex, Heading } from "theme-ui"

export interface ILayoutProps {}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex>
      <Flex
        aria-label="menu"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "16rem",
          padding: "1.6rem 3.2rem",
          listStyle: "none",
          gap: "1.6rem",
          background: "background2",
        }}
        role="menu"
      >
        <Flex
          sx={{
            flexDirection: "column",
          }}
        >
          <Heading variant="heading3">Characters</Heading>
          <Flex
            sx={{
              flexDirection: "column",
            }}
          >
            <Link href="/characters">List</Link>
            <Link href="/characters/new">New</Link>
          </Flex>
        </Flex>
        <Flex
          sx={{
            flexDirection: "column",
          }}
        >
          <Heading variant="heading3">Battles</Heading>
          <Flex
            sx={{
              flexDirection: "column",
            }}
          >
            <Link href="/battles">List</Link>
            <Link href="/battles/join">Join</Link>
          </Flex>
        </Flex>
        <Flex
          sx={{
            flexDirection: "column",
          }}
        >
          <Heading variant="heading3">Quests</Heading>
          <Flex
            sx={{
              flexDirection: "column",
            }}
          >
            <Link href="/quests">List</Link>
          </Flex>
        </Flex>
      </Flex>
      <main
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "64rem",
          margin: "0 auto",
          padding: "0 1.6rem",

          "@media (min-width: 64rem)": {
            minWidth: "64rem",
          },
        }}
      >
        {children}
      </main>
    </Flex>
  )
}
