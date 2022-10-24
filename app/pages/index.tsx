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
      <img src="https://inkarnate-api-as-production.s3.amazonaws.com/yczpt837wblc6jmq9uvodf3x95e0" />
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

        <Link href="/play" passHref>
          <ThemeLink
            sx={{
              position: "absolute",
              top: "19.2vw",
              alignSelf: "flex-start",

              "@media (min-width: 768px)": {
                // top: "32rem",
                left: "auto",
              },
            }}
            variant="gameButton"
          >
            Enter ChainQuest
          </ThemeLink>
        </Link>

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
            /** Workaround to keep it centralized in relation to the mennu */
            marginLeft: "-13rem",

            position: "relative",
          }}
        >
          <Heading mb="1.6rem" variant="heading2">
            Latest news
          </Heading>

          <NewsContentBlock title="Closed Beta launch." date="2022-10-20">
            <Text>
              Dear ChainQuest community, <br />
              You can now start creating your character
            </Text>
            <Text>
              And train your skills before we open the gates to the world of
              ChainQuest.
            </Text>
            <br />
            <Text>
              Kind Regards, <br />
              Ellagoris
            </Text>
          </NewsContentBlock>
        </Flex>
      </Flex>
    </Layout>
  )
}
