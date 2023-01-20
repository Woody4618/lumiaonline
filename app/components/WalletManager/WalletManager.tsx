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
import { WalletMultiButton } from "./WalletMultiButton"
import { Flex } from "theme-ui"
import theme from "@/styles/theme"

/**
 * Renders the connect button and also allows the user to manage their wallet.
 */
const WalletManager = () => {
  const wallet = useWallet()

  return (
    <Flex
      sx={{
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center",

        ".wallet-adapter-dropdown": {
          display: "flex",
          justifyContent: "center",
        },
      }}
    >
      <Flex
        sx={{
          justifyContent: "center",
        }}
      >
        {wallet?.publicKey ? (
          <WalletMultiButton
            sx={{
              backgroundColor: "unset",
              transition: "all .3s linear",
              color: "heading",
              lineHeight: "body",
              fontSize: "1.4rem",
              padding: "0",
              height: "unset",
              alignSelf: "flex-end",

              "&:hover": {
                background: "unset",
                backgroundImage: "unset!important",
                backgroundColor: "unset!important",
                color: "primary",
                cursor: "pointer",
              },
            }}
          ></WalletMultiButton>
        ) : (
          <WalletMultiButton
            sx={{
              backgroundColor: "unset",
              color: (t) =>
                t.rawColors?.text === theme.colors.text ? "background" : "text",
              lineHeight: "body",
              fontSize: "1.4rem",
              padding: ".8rem 1.6rem",
              height: "unset",
              alignSelf: "flex-end",
              display: "flex",
              background: (theme) => theme.colors?.primaryGradient,
              border: ".2rem solid transparent",
              transition: "all .125s linear",
              alignItems: "center",
              borderColor: "primary",
              opacity: 1,
              fontWeight: 500,

              "&:not(:disabled):hover": {
                bg: "background",
                cursor: "pointer",
                borderWidth: ".2rem",
                opacity: 0.7,
              },

              "&:disabled": {
                bg: "background",
                cursor: "not-allowed",
                opacity: 0.3,
              },
            }}
          >
            Connect
          </WalletMultiButton>
        )}
      </Flex>
    </Flex>
  )
}

export default WalletManager
