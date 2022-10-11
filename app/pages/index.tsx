/** @jsxImportSource theme-ui */
import Head from "next/head"

import { Heading, Text, Label, Flex } from "@theme-ui/components"

import Header from "@/components/Header/Header"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <Header />
      <main
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "64rem",
          margin: "0 auto",
          marginTop: "4rem",
          padding: "0 1.6rem",
        }}
      >
        <Heading mb=".8rem" variant="heading1">
          This is definitely an RPG
        </Heading>
        <Text>Exactly as the title says.</Text>
        <Heading mt="3.2rem" variant="heading2">
          Characters
        </Heading>
        <Flex
          sx={{
            gap: "1.6rem",
            marginBottom: "3.2rem",
          }}
        >
          <Link href="/create">Create</Link> or{" "}
          <Link href="/characters">List</Link>
        </Flex>
        <Heading variant="heading2">Quests</Heading>
        <Flex>
          <Link href="/quests">List</Link>
        </Flex>
      </main>
    </>
  )
}