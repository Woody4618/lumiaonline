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
import { useWallet } from "@solana/wallet-adapter-react"
import { Flex } from "theme-ui"
import { WalletMultiButton } from "./WalletManager/WalletMultiButton"

/**
 * Renders only the connect button. If there is public key, it will not render anything.
 */
const WalletConnectButton = ({
  label = <span>Select Wallet</span>,
}: {
  label: JSX.Element
}) => {
  const wallet = useWallet()

  if (wallet.publicKey) return null

  return (
    <Flex
      sx={{
        display: "inline-flex",
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center",

        ".wallet-adapter-dropdown": {
          display: "flex",
          justifyContent: "center",
        },
      }}
    >
      <WalletMultiButton
        sx={{
          backgroundColor: "unset",
          color: (t) => "unset",
          lineHeight: "body",
          fontSize: "1.4rem",
          padding: "0",
          height: "unset",
          alignSelf: "flex-end",
          display: "flex",
          background: "unset",
          border: "none",
          transition: "all .125s linear",
          alignItems: "center",
          borderColor: "primary",
          opacity: 1,
          fontWeight: 500,

          "&:not(:disabled):hover": {
            bg: "unset",
            cursor: "pointer",
            borderWidth: ".2rem",
            opacity: 0.7,
          },

          "&:disabled": {
            bg: "unset",
            cursor: "not-allowed",
            opacity: 0.3,
          },
        }}
      >
        {label || null}
      </WalletMultiButton>
    </Flex>
  )
}

export default WalletConnectButton
