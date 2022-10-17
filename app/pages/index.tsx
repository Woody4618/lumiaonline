/** @jsxImportSource theme-ui */
import { Heading, Text, Button, Flex } from "@theme-ui/components"

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
    <Layout>
      {isWalletReady && !publicKey ? (
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
      )}

      <Link href="/play">
        <Button
          sx={{
            alignSelf: "flex-start",
            marginBottom: "3.2rem",
          }}
        >
          Play
        </Button>
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
        elit. Nam pulvinar lacus at eros fermentum, vitae luctus nunc consequat.
        In ac cursus elit. Nulla elit sem, pharetra eu mattis id, suscipit ut
        massa. Fusce ornare, velit nec finibus blandit, diam nisl accumsan
        neque, eu sagittis eros erat quis magna. In bibendum laoreet accumsan.
        Ut eget euismod velit, eu suscipit lacus. Curabitur vitae vulputate
        massa. Quisque a congue massa. Quisque suscipit lorem sed ullamcorper
        consequat.
        <br />
        Aenean vel nibh accumsan, lobortis arcu a, bibendum metus. Pellentesque
        eleifend quis lectus sed semper. Cras ante felis, ultricies hendrerit
        sapien at, interdum ultricies turpis. Phasellus metus diam, pretium
        vitae efficitur eget, ultricies ac risus. Sed id gravida purus.
        Phasellus ut elit hendrerit enim posuere convallis nec quis nisl. Nulla
        vitae vulputate leo. Pellentesque aliquet orci quam. Vivamus vehicula
        posuere velit at interdum. Curabitur rhoncus varius sem, a posuere risus
        venenatis in. Aenean et nunc ut nisi accumsan dictum et vel metus. Nam
        tempus tortor ex, euismod tristique felis pulvinar at. Quisque sagittis
        neque sit amet quam ultrices lacinia. Duis lacinia porttitor rhoncus.
        Fusce bibendum ex nisl, sed tempus elit porttitor tincidunt.
      </Text>
    </Layout>
  )
}
