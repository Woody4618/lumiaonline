/** @jsxImportSource theme-ui */
import Head from "next/head"

import { Heading, Text, Label } from "@theme-ui/components"

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
          This definitely is an RPG
        </Heading>
        <Text>Exactly as the title says.</Text>
        <Link href="/create">Create</Link> or{" "}
        <Link href="/characters">List</Link>
      </main>
    </>
  )
}
