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
        }}
      >
        <Flex
          aria-label="menu"
          sx={{
            display: "flex",

            flexDirection: "column",
            minWidth: "26rem",
            padding: "1.6rem 3.2rem",
            listStyle: "none",
            gap: "1.6rem",
            borderRight: "1px solid",
            borderColor: "background2",
          }}
          role="menu"
        >
          {/* {publicKey && isWalletReady ? (
            <CharacterSelect
              onChange={(event) => setSelectedCharacter(event.value)}
              name="character"
              characters={characters}
            />
          ) : null} */}
          <Flex
            sx={{
              flexDirection: "column",
            }}
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
          {/* <Flex
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
          </Flex> */}
        </Flex>
        <main
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            maxWidth: type === "default" ? "48rem" : "unset",
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
              // marginLeft: "-16rem",
              paddingTop: "4rem",
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
