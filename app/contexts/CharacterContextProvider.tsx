import {
  createContext,
  Dispatch,
  SetStateAction,
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

export type CharacterApiResponseWithNft = {
  pubkey: PublicKey
  account: CharacterAccount
} & {
  nft: Sft | SftWithToken | Nft | NftWithToken
}
export const characterContext = createContext<{
  selectedCharacter: CharacterApiResponseWithNft | false

  setSelectedCharacter: Dispatch<
    SetStateAction<CharacterApiResponseWithNft | false>
  >
  characters: CharacterApiResponseWithNft[]
}>({
  selectedCharacter: null,

  setSelectedCharacter: null,
  characters: null,
})

export function CharacterContextProvider({ children }) {
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const [characters, setCharacters] =
    useState<CharacterApiResponseWithNft[]>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<
    CharacterApiResponseWithNft | false
  >(null)

  useEffect(() => {
    if (publicKey) {
      ;(async () => {
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
          setSelectedCharacter(withNft[0])
        } else {
          setSelectedCharacter(false)
        }
      })()
    }
  }, [publicKey])

  return (
    <characterContext.Provider
      value={{
        selectedCharacter,
        characters,
        setSelectedCharacter,
      }}
    >
      {children}
    </characterContext.Provider>
  )
}
