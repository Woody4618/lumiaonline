/**
  Lumia Online (https://github.com/lumiaonline)
  Copyright (C) 2023 lumiaonline

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
import React from "react"
import Head from "next/head"
import { ThemeProvider } from "theme-ui"
import Router, { AppProps } from "next/dist/shared/lib/router/router"
import dynamic from "next/dynamic"

import "@solana/wallet-adapter-react-ui/styles.css"

// @ts-ignore
import withGA from "next-ga"

import defaultTheme from "../styles/theme"
import { Toaster } from "react-hot-toast"
import { Layout } from "@/components/Layout/Layout"
import { CharacterContextProvider } from "contexts/CharacterContextProvider"

const WalletProvider = dynamic(() => import("contexts/WalletProvider"), {
  ssr: false,
})

function App(props: AppProps) {
  const { Component, pageProps } = props

  return (
    <ThemeProvider theme={defaultTheme}>
      <Head>
        {/** Load font styles directly on the document to prevent flashes */}
        <title>Lumia Online</title>
        <link href="/fonts/fonts.css" rel="stylesheet" />
        <link rel="icon" href="/lumia2.ico" />
      </Head>

      <WalletProvider>
        <CharacterContextProvider>
          <Toaster />

          <Component {...pageProps} />
        </CharacterContextProvider>
      </WalletProvider>
    </ThemeProvider>
  )
}

export default withGA(process.env.NEXT_PUBLIC_GA_ID, Router)(App)
