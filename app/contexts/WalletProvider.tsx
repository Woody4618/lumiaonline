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
import React, { FC, useMemo } from "react"
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react"
import { Adapter, WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
  BackpackWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css")

const Wallet = ({ children }: { children: React.ReactChild }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.

  const network = process.env
    .NEXT_PUBLIC_CONNECTION_NETWORK as WalletAdapterNetwork

  const endpoint =
    process.env.NEXT_PUBLIC_CONNECTION_NETWORK == "devnet"
      ? process.env.NEXT_PUBLIC_SOLANA_RPC_HOST_DEVNET
      : process.env.NEXT_PUBLIC_SOLANA_RPC_HOST_MAINNET_BETA

  const wallets = useMemo(
    () => [
      /**
       * Select the wallets you wish to support, by instantiating wallet adapters here.
       *
       * Common adapters can be found in the npm package `@solana/wallet-adapter-wallets`.
       * That package supports tree shaking and lazy loading -- only the wallets you import
       * will be compiled into your application, and only the dependencies of wallets that
       * your users connect to will be loaded.
       */
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
      new SlopeWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    []
  )

  return (
    <ConnectionProvider
      endpoint={endpoint}
      config={{ commitment: "confirmed" }}
    >
      <WalletProvider wallets={wallets as Adapter[]} autoConnect>
        <WalletModalProvider>
          {children}{" "}
          {/* Your app's components go here, nested within the context providers. */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default Wallet
