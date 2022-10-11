/** @jsxImportSource theme-ui */
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Flex } from "theme-ui"
import theme from "@/styles/theme"

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
          ></WalletMultiButton>
        )}
      </Flex>
    </Flex>
  )
}

export default WalletManager
