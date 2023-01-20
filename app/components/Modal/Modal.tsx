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
import * as React from "react"
import { Button, Flex } from "theme-ui"
import { CloseIcon } from "../icons"

type Props = {
  children: React.ReactNode
  isOpen: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
}

export function Modal({ className, children, isOpen, setIsOpen }: Props) {
  return (
    <>
      <Flex
        sx={{
          display: isOpen ? "flex" : "none",

          flexDirection: "column",
          padding: "3.2rem 1.6rem",
          listStyle: "none",
          gap: "1.6rem",
          border: "1px solid",
          borderColor: "background2",
          alignSelf: "flex-start",

          position: "absolute",
          top: "12rem",
          margin: "0 auto",
          left: 0,
          right: 0,
          flex: 0,
          background: "background",
          boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
          zIndex: 10,

          "@media (min-width: 768px)": {
            width: "96rem",
          },
        }}
        className={className}
      >
        {setIsOpen ? (
          <Flex
            sx={{
              justifyContent: "flex-end",
            }}
          >
            <Button variant="resetted" onClick={() => setIsOpen(false)}>
              {" "}
              <CloseIcon />
            </Button>
          </Flex>
        ) : null}
        {children}
      </Flex>
      {/** Background Blur */}
      <div
        onClick={setIsOpen ? () => setIsOpen(false) : null}
        sx={{
          display: isOpen ? "block" : "none",
          zIndex: 9,
          "::before": {
            content: "''",
            position: "fixed",
            backgroundColor: "background",
            zIndex: 8,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            opacity: 0.3,
          },
        }}
      ></div>
    </>
  )
}
