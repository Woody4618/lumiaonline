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

import { useWallet } from "@solana/wallet-adapter-react"
import { CharacterApiResponseWithNft } from "contexts/CharacterContextProvider"
import Select, { ActionMeta, StylesConfig } from "react-select"
import { useThemeUI, Flex, Text } from "theme-ui"

const SelectorNFTOptionLabel = ({
  imgSrc,
  name,
}: {
  imgSrc: string
  name: string
}) => {
  return (
    <Flex
      sx={{
        alignItems: "center",
        gap: "1.6rem",
      }}
    >
      <img
        src={imgSrc}
        sx={{
          maxHeight: "4.8rem",
        }}
      />
      <Text mr="1.6rem">
        {name.length > 12 ? name.slice(0, 6).concat("...") : name}
      </Text>
    </Flex>
  )
}

const CharacterSelect = ({
  name,
  characters = null,
  onChange,
}: {
  name: string
  characters: CharacterApiResponseWithNft[]
  value?: any
  onChange?: (
    newValue: {
      value: string
      label: JSX.Element
    },
    actionMeta: ActionMeta<any>
  ) => void
}) => {
  const { publicKey } = useWallet()
  const { theme } = useThemeUI()

  const options =
    characters &&
    characters.map((character) => ({
      value: character.pubkey.toString(),
      label: (
        <SelectorNFTOptionLabel
          imgSrc={character.nft.json.image}
          name={character?.account.name}
        />
      ),
    }))

  const colourStyles: StylesConfig = {
    control: (styles) => ({
      ...styles,
      backgroundColor: theme?.colors.background.toString(),
      minHeight: "6.4rem",
    }),

    container: (styles) => ({
      ...styles,
      minWidth: "8rem",
    }),

    menu: (styles) => ({
      ...styles,
      backgroundColor: theme?.colors.background.toString(),
    }),

    option: (styles, { isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isFocused
          ? "#333"
          : isSelected
          ? theme?.colors.background.toString()
          : undefined,
        color: isDisabled
          ? "#ccc"
          : isSelected
          ? theme?.colors.primary.toString()
          : theme?.colors.text.toString(),
        cursor: isDisabled ? "not-allowed" : "pointer",

        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled ? "#333" : undefined,
        },
      }
    },
    singleValue: (styles) => ({
      ...styles,
      color: theme?.colors.text.toString(),
    }),
  }

  if (!options?.length) return null

  return (
    <Select
      key={"nftselect-" + options?.length}
      name={name}
      defaultValue={options?.[0]}
      options={options || []}
      styles={colourStyles}
      onChange={onChange}
      placeholder={
        <SelectorNFTOptionLabel
          name={
            publicKey
              ? characters
                ? "Select a character"
                : "Loading characters..."
              : "Connect your wallet."
          }
          imgSrc="https://via.placeholder.com/480x480"
        />
      }
    />
  )
}
export default CharacterSelect
