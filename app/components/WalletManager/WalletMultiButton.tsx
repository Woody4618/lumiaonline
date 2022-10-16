/** @jsxImportSource theme-ui */
import { useWallet } from "@solana/wallet-adapter-react"
import {
  useWalletModal,
  WalletConnectButton,
  WalletModalButton,
} from "@solana/wallet-adapter-react-ui"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "theme-ui"

export const WalletMultiButton = ({ children = null, ...props }) => {
  const { publicKey, wallet, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [copied, setCopied] = useState(false)
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLUListElement>(null)

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey])
  const content = useMemo(() => {
    if (children) return children
    if (!wallet || !base58) return null
    return base58.slice(0, 4) + ".." + base58.slice(-4)
  }, [children, wallet, base58])

  const copyAddress = useCallback(async () => {
    if (base58) {
      await navigator.clipboard.writeText(base58)
      setCopied(true)
      setTimeout(() => setCopied(false), 400)
    }
  }, [base58])

  const openDropdown = useCallback(() => {
    setActive(true)
  }, [])

  const closeDropdown = useCallback(() => {
    setActive(false)
  }, [])

  const openModal = useCallback(() => {
    setVisible(true)
    closeDropdown()
  }, [setVisible, closeDropdown])

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const node = ref.current

      // Do nothing if clicking dropdown or its descendants
      if (!node || node.contains(event.target as Node)) return

      closeDropdown()
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, closeDropdown])

  if (!wallet)
    return <WalletModalButton {...props}>{children}</WalletModalButton>
  if (!base58)
    return <WalletConnectButton {...props}>{children}</WalletConnectButton>

  return (
    <div className="wallet-adapter-dropdown">
      <Button
        sx={{
          alignItems: "center",
          gap: ".8rem",
        }}
        variant="resetted"
        aria-expanded={active}
        className="wallet-adapter-button-trigger"
        style={{ pointerEvents: active ? "none" : "auto", ...props.style }}
        onClick={openDropdown}
        {...props}
      >
        <img
          sx={{
            maxWidth: "2.4rem",
          }}
          src={wallet.adapter.icon}
          alt={`${wallet.adapter.name} icon`}
          {...props}
        />
        {content}
      </Button>
      <ul
        aria-label="dropdown-list"
        className={`wallet-adapter-dropdown-list ${
          active && "wallet-adapter-dropdown-list-active"
        }`}
        sx={{
          background: "background",
          "li:hover": {
            backgroundColor: (theme) => theme.colors.primary + "!important",
            color: "background",
            opacity: 0.7,
          },
        }}
        ref={ref}
        role="menu"
      >
        Account
        <li className="wallet-adapter-dropdown-list-item" role="menuitem">
          <Link href="/characters/new" passHref>
            <a
              sx={{
                "&:hover": {
                  color: "background",
                },
              }}
            >
              New Character
            </a>
          </Link>
        </li>
        Wallet
        <li
          onClick={copyAddress}
          className="wallet-adapter-dropdown-list-item"
          role="menuitem"
        >
          {copied ? "Copied" : "Copy address"}
        </li>
        <li
          onClick={openModal}
          className="wallet-adapter-dropdown-list-item"
          role="menuitem"
        >
          Change wallet
        </li>
        <li
          onClick={disconnect}
          className="wallet-adapter-dropdown-list-item"
          role="menuitem"
        >
          Disconnect
        </li>
      </ul>
    </div>
  )
}
