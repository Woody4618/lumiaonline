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
/** @jsxImportSource theme-ui */
import React, { useRef, useState } from "react"
import { Button, Flex, Text } from "theme-ui"

import { DotsIcon } from "@/components/icons/"
import { FindNftByMintOutput } from "@metaplex-foundation/js"

type Props = {
  item: FindNftByMintOutput
  additionalOptions?: React.ReactElement
  onClick?: (item: FindNftByMintOutput) => void
  className?: string
}

const CollectionItem = (props: Props) => {
  const { item, additionalOptions = null, className, onClick } = props
  const [isDropdownActive, setIsDropdownActive] = useState(false)

  const handleDropdownToggle = () => {
    setIsDropdownActive((previous) => !previous)
  }

  if (!item) return null

  const { uri, json } = item

  const handleOnClick = (item: FindNftByMintOutput) => () =>
    onClick ? onClick(item) : true
  const handleKeyDown =
    (item: FindNftByMintOutput) => (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (onClick && e.keyCode == 13) {
        onClick(item)
      }

      return true
    }

  return (
    <Flex
      tabIndex={1}
      sx={{
        flexDirection: "column",
        position: "relative",
        transition: "all .125s linear",
        outline: "none",
        cursor: onClick ? "pointer" : "auto",

        "&:hover, &:focus, > .toggle-menu:focus": {
          "> .toggle-menu": {
            visibility: "visible",
            opacity: 1,
          },

          "> img": {
            opacity: 0.7,
          },
        },
      }}
      className={className}
      onClick={handleOnClick(item)}
      onKeyDown={handleKeyDown(item)}
    >
      <Button
        tabIndex={1}
        variant="resetted"
        className="toggle-menu"
        onClick={handleDropdownToggle}
        sx={{
          display: "flex",
          position: "absolute",
          visibility: isDropdownActive ? "visible" : "hidden",
          opacity: isDropdownActive ? 1 : 0,
          right: ".8rem",
          top: ".8rem",
          zIndex: 1,
          transition: "all .125s linear",

          "&:hover, &:focus": {
            visibility: "visible",
            cursor: "pointer",
            opacity: 1,
          },
        }}
      >
        <DotsIcon
          sx={{
            width: "3.2rem",
            height: "3.2rem",
            stroke: "heading",
            strokeWidth: "2",
          }}
        />
      </Button>
      {/** Dropdown */}
      <Flex
        sx={{
          position: "absolute",
          visibility: isDropdownActive ? "visible" : "hidden",
          opacity: isDropdownActive ? 1 : 0,
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "2.4rem 1.2rem",
          top: 40,
          right: 0,
          backgroundColor: "background",
          transition: "all .125s linear",
          boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
          gap: ".8rem",
          zIndex: 2,
          fontSize: "1.2rem",

          a: {
            whiteSpace: "nowrap",
          },
        }}
      >
        <a href={uri} rel="noopener noreferrer" target="_blank" tabIndex={1}>
          View raw JSON
        </a>
        <a
          href={json.image}
          rel="noopener noreferrer"
          target="_blank"
          tabIndex={1}
        >
          View image
        </a>
        {additionalOptions || null}
      </Flex>
      <img
        sx={{
          borderRadius: ".4rem",
          transition: "all .125s linear",
          opacity: isDropdownActive ? 0.7 : 1,
        }}
        src={json.image}
      />
      <Text
        variant="small"
        sx={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          padding: "0 .8rem",
          mt: ".8rem",
        }}
      >
        {json.name}
        {/* <br />
    <a
      href={`https://solscan.io/token/${onchainMetadata.metaData.mint}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {onchainMetadata.metaData.mint}
    </a> */}
      </Text>
    </Flex>
  )
}

export default CollectionItem
