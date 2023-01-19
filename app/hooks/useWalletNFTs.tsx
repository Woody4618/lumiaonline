/**
  Lumia Online (https://github.com/lumiaonline)
  Copyright (C) 2023 lumiaonline

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
import { useCallback, useEffect, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import {
  Metaplex,
  Metadata,
  JsonMetadata,
  FindNftByMintOutput,
} from "@metaplex-foundation/js"

const useWalletNFTs = (creators: string[] = null) => {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [walletNFTs, setWalletNFTs] = useState<FindNftByMintOutput[] | null>(
    null
  )

  const fetchNFTs = useCallback(async () => {
    const metaplex = Metaplex.make(connection)

    console.time("fetch")
    /** Fetch on-chain metadatas */
    const metadatas = await metaplex
      .nfts()
      .findAllByOwner({ owner: publicKey, commitment: "confirmed" })
      .run()

    /** Filter by creator */
    const filteredMetadatas = creators
      ? metadatas.filter((NFT) => {
          const obj = NFT.creators?.find((value) => {
            return creators.indexOf(value.address.toString()) !== -1
          })

          return obj
        })
      : metadatas

    /** Fetch JSON for all on-chain metadatas */
    const NFTs = await Promise.all(
      filteredMetadatas.map(async (metadata: Metadata<JsonMetadata<string>>) =>
        metaplex.nfts().load({ metadata }).run()
      )
    )

    console.timeEnd("fetch")

    setWalletNFTs(NFTs)
  }, [connection, publicKey])

  useEffect(() => {
    if (publicKey) {
      fetchNFTs()
    }
  }, [publicKey])

  return { walletNFTs, fetchNFTs }
}

export default useWalletNFTs
