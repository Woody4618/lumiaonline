/** @jsxImportSource theme-ui */
import { Heading, Flex } from "@theme-ui/components"

import { useRouter } from "next/router"
import { useWallet } from "@solana/wallet-adapter-react"
import { BackIcon } from "@/components/icons"
import Link from "next/link"
import WalletManager from "@/components/WalletManager/WalletManager"
import { CreateCharacterForm } from "@/components/CreateCharacterForm"
import { Layout } from "@/components/Layout/Layout"

export default function Create() {
  const { publicKey } = useWallet()
  const { query } = useRouter()

  const isOnboarding = query.onboarding === "true"

  return (
    <Layout>
      <Heading mb="1.6rem" variant="heading">
        {isOnboarding
          ? "Let's start with your character"
          : "Create a new character"}
      </Heading>
      <CreateCharacterForm />
    </Layout>
  )
}
