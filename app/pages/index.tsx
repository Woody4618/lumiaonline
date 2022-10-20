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
              top: "5rem",
              left: "4rem",
              alignSelf: "flex-start",

              "@media (min-width: 768px)": {
                top: "32rem",
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

        <Heading variant="heading2">Latest news</Heading>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu
          auctor felis. Cras augue nibh, bibendum et lorem eget, ultrices ornare
          elit. Nam pulvinar lacus at eros fermentum, vitae luctus nunc
          consequat. In ac cursus elit. Nulla elit sem, pharetra eu mattis id,
          suscipit ut massa. Fusce ornare, velit nec finibus blandit, diam nisl
          accumsan neque, eu sagittis eros erat quis magna. In bibendum laoreet
          accumsan. Ut eget euismod velit, eu suscipit lacus. Curabitur vitae
          vulputate massa. Quisque a congue massa. Quisque suscipit lorem sed
          ullamcorper consequat.
          <br />
          Aenean vel nibh accumsan, lobortis arcu a, bibendum metus.
          Pellentesque eleifend quis lectus sed semper. Cras ante felis,
          ultricies hendrerit sapien at, interdum ultricies turpis. Phasellus
          metus diam, pretium vitae efficitur eget, ultricies ac risus. Sed id
          gravida purus. Phasellus ut elit hendrerit enim posuere convallis nec
          quis nisl. Nulla vitae vulputate leo. Pellentesque aliquet orci quam.
          Vivamus vehicula posuere velit at interdum. Curabitur rhoncus varius
          sem, a posuere risus venenatis in. Aenean et nunc ut nisi accumsan
          dictum et vel metus. Nam tempus tortor ex, euismod tristique felis
          pulvinar at. Quisque sagittis neque sit amet quam ultrices lacinia.
          Duis lacinia porttitor rhoncus. Fusce bibendum ex nisl, sed tempus
          elit porttitor tincidunt.
        </Text>
      </Flex>
    </Layout>
  )
}
