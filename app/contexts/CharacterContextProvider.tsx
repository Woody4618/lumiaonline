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
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react"
import { getCharacters } from "lib/program-utils"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import {
  Metaplex,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
} from "@metaplex-foundation/js"
import { PublicKey } from "@solana/web3.js"
import { CharacterAccount } from "lib/gen/accounts"
import useWalletWrapper from "@/hooks/useWalletWrapper"

export type CharacterApiResponseWithNft = {
  pubkey: PublicKey
  account: CharacterAccount
} & {
  nft: Sft | SftWithToken | Nft | NftWithToken
}
export const characterContext = createContext<{
  selectedCharacter: CharacterApiResponseWithNft

  setSelectedCharacter: Dispatch<SetStateAction<CharacterApiResponseWithNft>>
  characters: CharacterApiResponseWithNft[]
  isLoading: boolean
  fetchCharacters: () => Promise<void>
}>({
  selectedCharacter: null,

  setSelectedCharacter: null,
  characters: null,
  isLoading: false,
  fetchCharacters: null,
})

export function CharacterContextProvider({ children }) {
  const { publicKey, isWalletReady } = useWalletWrapper()
  const { connection } = useConnection()
  const [characters, setCharacters] =
    useState<CharacterApiResponseWithNft[]>(null)
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterApiResponseWithNft>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchCharacters = useCallback(async () => {
    setIsLoading(true)
    const userCharacters = await getCharacters(connection, publicKey)

    const metaplex = Metaplex.make(connection)

    const withNft = await Promise.all(
      userCharacters.map(async (character) => {
        const nft = await metaplex
          .nfts()
          .findByMint({ mintAddress: character.account.nftMint })
          .run()

        return Object.assign(character, { nft })
      })
    )

    setCharacters(withNft)

    if (withNft.length) {
      /** Select the first character, or the previous selected character to update the object */
      const selectedCharacterIndex = selectedCharacter
        ? characters.findIndex(
            (char) =>
              char.pubkey.toString() === selectedCharacter.pubkey.toString()
          )
        : 0

      setSelectedCharacter(withNft[selectedCharacterIndex])
    }

    setIsLoading(false)
  }, [isWalletReady, publicKey, selectedCharacter])

  useEffect(() => {
    if (isWalletReady && publicKey) {
      fetchCharacters()
    } else if (isWalletReady && !publicKey) {
      setIsLoading(false)
    }
  }, [isWalletReady, publicKey])

  return (
    <characterContext.Provider
      value={{
        selectedCharacter,
        characters,
        setSelectedCharacter,
        isLoading,
        fetchCharacters,
      }}
    >
      {children}
    </characterContext.Provider>
  )
}
