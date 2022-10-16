/** @jsxImportSource theme-ui */
import { characterContext } from "contexts/CharacterContextProvider"
import Link from "next/link"
import { useContext } from "react"
import { Flex, Heading } from "theme-ui"
import Header from "../Header/Header"
import CharacterSelect from "./CharacterSelect"

export interface ILayoutProps {}

export function Layout({ children }: { children: React.ReactNode }) {
  const { characters, setSelectedCharacter } = useContext(characterContext)

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
            width: "24rem",
            padding: "1.6rem 3.2rem",
            listStyle: "none",
            gap: "1.6rem",
            borderRight: "1px solid",
            borderColor: "background2",
          }}
          role="menu"
        >
          <CharacterSelect
            onChange={(event) => setSelectedCharacter(event.value)}
            name="character"
            characters={characters}
          />
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
            alignItems: "stretch",
            maxWidth: "48rem",
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
            }}
          >
            {children}
          </Flex>
        </main>
      </Flex>
    </Flex>
  )
}
