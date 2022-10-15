/** @jsxImportSource theme-ui */
import { Heading, Flex } from "@theme-ui/components"

import { useRouter } from "next/router"
import { useWallet } from "@solana/wallet-adapter-react"
import { BackIcon } from "@/components/icons"
import Link from "next/link"
import WalletManager from "@/components/WalletManager/WalletManager"
import { CreateCharacterForm } from "@/components/CreateCharacterForm"

export default function Create() {
  const { publicKey } = useWallet()
  const { query } = useRouter()

  const isOnboarding = query.onboarding === "true"

  return (
    <>
      <Flex
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
          minHeight: "9rem",
        }}
      >
        <Link href="/" passHref>
          <a
            sx={{
              alignSelf: "flex-start",
              margin: "1.6rem 0",
            }}
          >
            <BackIcon />
          </a>
        </Link>
        {publicKey ? (
          <Flex
            sx={{
              margin: "3.2rem 0",
              alignSelf: "flex-end",
            }}
          >
            <WalletManager />
          </Flex>
        ) : null}
      </Flex>
      <Heading mb="1.6rem" variant="heading">
        {isOnboarding
          ? "Let's start with your character"
          : "Create a new character"}
      </Heading>
      <CreateCharacterForm />
    </>
  )
}
