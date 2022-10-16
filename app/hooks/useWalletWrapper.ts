import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"

/** Wrapper around useWallet to set the ready variable */
const useWalletWrapper = () => {
  const walletContetState = useWallet()

  const { publicKey, wallet, autoConnect } = walletContetState
  /** Boolean for whether the wallet provider has finished running or not. */
  const [isWalletReady, setIsWalletReady] = useState(false)

  /**
   * If there is localStorage for the wallet adapter
   * It means the wallet provider will try to connect automatically.
   * So we wait for the wallet to be ready Before assuming the user hasn't connected.
   */
  useEffect(() => {
    const walletName = localStorage.getItem("walletName")

    if (autoConnect && walletName && publicKey) {
      setIsWalletReady(true)
    } else if (!walletName || !autoConnect) {
      setIsWalletReady(true)
    }
  }, [publicKey, wallet, autoConnect])

  return {
    ...walletContetState,
    isWalletReady,
  }
}

export default useWalletWrapper
