/** @jsxImportSource theme-ui */
import Link from "next/link"
import * as React from "react"
import { Flex, Heading } from "theme-ui"
import Header from "../Header/Header"

export interface ILayoutProps {}

export function Layout({ children }: { children: React.ReactNode }) {
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
        }}
      >
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
            <Heading variant="heading3">Community</Heading>
            <Flex
              sx={{
                flexDirection: "column",
              }}
            >
              <Link href="/characters">Characters</Link>
              <Link href="/battles">Latest Battles</Link>
              <Link href="/highscores">Highscores</Link>
            </Flex>
          </Flex>
          <Flex
            sx={{
              flexDirection: "column",
            }}
          >
            <Heading variant="heading3">Play</Heading>
            <Flex
              sx={{
                flexDirection: "column",
              }}
            >
              <Link href="/battles/join">Join Battle</Link>
              <Link href="/quests">Join Quest</Link>
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
          <Flex
            sx={{
              flexDirection: "column",
              /** Workaround to keep it centralized in relation to the mennu */
              marginLeft: "-16rem",
              paddingTop: "4rem",
            }}
          >
            {children}
          </Flex>
        </main>
      </Flex>
    </Flex>
  )
}
