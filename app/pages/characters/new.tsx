/**
  Lumia Online (https://github.com/lumiaonline)
  Copyright (C) 2023 Lumia Online

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
