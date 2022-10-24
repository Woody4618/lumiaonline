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
        <Flex
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
        </Flex>
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
              /** Workaround to keep it centralized in relation to the mennu */
              marginLeft: type === "default" ? "-13rem" : "0",

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
