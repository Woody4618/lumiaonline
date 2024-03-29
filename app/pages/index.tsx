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
import {
  Heading,
  Text,
  Button,
  Flex,
  Link as ThemeLink,
} from "@theme-ui/components"

import WalletConnectButton from "@/components/WalletConnectButton"
import { WalletIcon } from "@/components/icons"
import { CreateCharacterForm } from "@/components/CreateCharacterForm"
import useWalletWrapper from "@/hooks/useWalletWrapper"
import Link from "next/link"
import { Layout } from "@/components/Layout/Layout"
import { ButtonSpecial } from "@/components/ButtonSpecial"

const NewsContentBlock = (props) => {
  const { children, title, date } = props

  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        marginTop: "1.6rem",
        marginBottom: "4.8rem",
        borderBottom: "1px solid",
        borderColor: "secondary",
        paddingBottom: "1.2rem",
      }}
    >
      <Heading mb="1.6rem" variant="heading3">
        {title}&nbsp;&nbsp;
        <Text sx={{ display: "inline-block" }} variant="xsmall">
          {date}{" "}
        </Text>
      </Heading>
      {children}
    </div>
  )
}

export default function Home() {
  const { publicKey, wallet, autoConnect, isWalletReady } = useWalletWrapper()

  // const isOnboarding = !localStorage.getItem('onboardDone')

  return (
    <Layout type="full">
      {/* <img src="https://inkarnate-api-as-production.s3.amazonaws.com/yczpt837wblc6jmq9uvodf3x95e0" /> */}

      <Flex
        sx={{
          minHeight: "28vw",
          position: "relative",
        }}
      >
        <img src="/assets/background-main.png" />
        <Link href="/play" passHref>
          <a>
            <ButtonSpecial
              sx={{
                position: "absolute",
                top: "50%",
                left: "calc(50% - 192px)",
                alignSelf: "flex-start",
              }}
            >
              Enter Lumia
            </ButtonSpecial>
          </a>
        </Link>
      </Flex>
      <Flex
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          maxWidth: "48rem",
          margin: "0 auto",
          padding: "3.2rem 1.6rem",

          "@media (min-width: 64rem)": {
            minWidth: "64rem",
          },
        }}
      >
        {/* {isWalletReady && !publicKey ? (
          <>Gm</>
        ) : (
          <Heading
            sx={{
              alignSelf: "stretch",
            }}
            mb="1.6rem"
            variant="heading"
          >
            {publicKey ? `Gm, ` : `Gm`}
            <Text variant="heading3">
              {publicKey ? publicKey?.toString().slice(0, 6) + "..." : null}
            </Text>
          </Heading>
        )} */}

        {/** User onboarding */}
        {/* {isWalletReady && !publicKey ? (
        <>
        <Text
              sx={{
                display: "flex",
              }}
              variant="heading3"
            >
              Let's start with your character
            </Text>
          <CreateCharacterForm />

          <Flex
            sx={{
              alignItems: "center",
              gap: ".8rem",
              margin: "1.6rem 0",
              alignSelf: "center",
            }}
          >
            <Text variant="small">Already registered? </Text>

            <WalletConnectButton
              label={
                <Flex
                  sx={{
                    alignItems: "center",
                    gap: ".4rem",
                  }}
                >
                  <WalletIcon
                    sx={{
                      height: "2.4rem",
                      width: "2.4rem",
                      stroke: "primary",
                    }}
                  />
                  Log-in
                </Flex>
              }
            />
          </Flex>
        </>
      ) : null} */}
        <Flex
          sx={{
            flexDirection: "column",

            position: "relative",
          }}
        >
          <Heading mb="1.6rem" variant="heading2">
            Latest news
          </Heading>

          <NewsContentBlock title="Open Alpha launch." date="2023-01-23">
            <Text>
              Dear Lumia community, <br />
              You can now start creating your character
            </Text>
            <Text>
              And train your skills before we open the gates to the world of
              Lumia.
            </Text>
            <br />
            {/* <Text>
              Kind Regards, <br />
              Ellagoris
            </Text> */}
          </NewsContentBlock>
        </Flex>
      </Flex>
    </Layout>
  )
}
