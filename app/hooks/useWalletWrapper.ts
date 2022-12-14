import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"

/** Wrapper around useWallet to set the 'isWalletReady' variable */
const useWalletWrapper = () => {
  const walletContetState = useWallet()

  const { publicKey, wallet, autoConnect, wallets } = walletContetState
  /** Boolean for whether the wallet provider has finished running or not. */
  const [isWalletReady, setIsWalletReady] = useState(false)

  /**
   * If there is localStorage for the wallet adapter
   * It means the wallet provider will try to connect automatically.
   * So we wait for the wallet to be ready Before assuming the user hasn't connected.
   */
  useEffect(() => {
    const walletName = localStorage.getItem("walletName")?.replaceAll('"', "")

    const availableWallets = wallets.map((wallet) =>
      wallet.adapter.name.toString()
    )

    /**
     * Here `walletName` can be set from another chain.
     *
     * For example, Aptos uses it through their wallet providers
     * So we try to ignore unexpected wallet names.
     * */
    const isWalletValid = walletName
      ? availableWallets.indexOf(walletName) === -1
        ? false
        : true
      : true

    if (autoConnect && walletName && publicKey) {
      setIsWalletReady(true)
    } else if (!walletName || !autoConnect) {
      setIsWalletReady(true)
    } else if (!isWalletValid) {
      /** If the wallet is invalid, set the state ready so the user can select a new one */
      setIsWalletReady(true)
    }
  }, [publicKey, wallet, autoConnect])

  return {
    ...walletContetState,
    isWalletReady,
  }
}

export default useWalletWrapper
