import { web3 } from "@project-serum/anchor"

export const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
)

export const getCharacterAddress = (
  owner: web3.PublicKey,
  nftMint: web3.PublicKey,
  charactersProgram: web3.PublicKey
): web3.PublicKey => {
  return web3.PublicKey.findProgramAddressSync(
    [Buffer.from("character"), owner.toBuffer(), nftMint.toBuffer()],
    charactersProgram
  )[0]
}

export const getTokenMetadataAddress = (
  nftMint: web3.PublicKey
): web3.PublicKey => {
  return web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      nftMint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0]
}
