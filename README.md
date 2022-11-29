# lumia

Monorepo for Lumia website & game

`app`: NextJS frontend app
`programs`: Anchor programs

## dev requisites

Install Anchor - https://www.anchor-lang.com/docs/installation

## installation

- Go to `app`, run `yarn`

## develop locally

- Get the Anchor config to use your NFTs locally: https://anchor-localnet-nfts.vercel.app/
- Put the anchor config on the Anchor.toml file
- Configure your wallet on Anchor.toml `wallet`

- Run `anchor test --detach` on the root folder
- Run `yarn dev` on the app/ folder
- Navigate to localhost
