/** @jsxImportSource theme-ui */
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Flex } from "theme-ui"

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
          color: (t) => "text",
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
