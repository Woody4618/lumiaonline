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
}>({
  selectedCharacter: null,

  setSelectedCharacter: null,
  characters: null,
  isLoading: false,
})

export function CharacterContextProvider({ children }) {
  const { publicKey, isWalletReady } = useWalletWrapper()
  const { connection } = useConnection()
  const [characters, setCharacters] =
    useState<CharacterApiResponseWithNft[]>(null)
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterApiResponseWithNft>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isWalletReady && publicKey) {
      ;(async () => {
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
          setSelectedCharacter(withNft[0])
        }

        setIsLoading(false)
      })()
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
      }}
    >
      {children}
    </characterContext.Provider>
  )
}
