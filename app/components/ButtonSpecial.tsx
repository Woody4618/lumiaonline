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
import * as React from "react"
import { Button } from "theme-ui"
import { BorderDetail } from "./icons"

export interface IButtonSpecialProps {
  children: React.ReactNode
  className?: string
}

export function ButtonSpecial({ className, children }: IButtonSpecialProps) {
  return (
    <Button
      sx={{
        boxShadow:
          "0px 0px 1px 1px #44383A, inset 0px 0px 5px rgba(222, 204, 165, 0.7), inset 0px 0px 1px 3px #44383A",
        borderRadius: "4px",
        border: "2px solid #AB9565",
        background: "linear-gradient(0deg, #040403, #040403)",
        padding: ".4rem",

        "&:not(:disabled):hover": {
          cursor: "pointer",
          opacity: 1,
        },

        "&:disabled": {
          cursor: "not-allowed",
          opacity: 0.3,
        },
      }}
      className={className}
      variant="resetted"
    >
      <span
        sx={{
          border: "1px solid #AB9565",
          padding: ".6rem 2.4rem .4rem 2.4rem",
        }}
      >
        <BorderDetail
          key={1}
          sx={{
            position: "absolute",
            right: ".4rem",
            top: ".4rem",
          }}
        />
        <span
          sx={{
            fontFamily: "MartelBold",
            fontStyle: "normal",
            fontSize: "2.4rem",
            display: "flex",
            lineHeight: 1,
            alignItems: "center",

            background:
              "linear-gradient(180deg, #EDE8A2 0.62%, #998663 100.62%)",
            backgroundClip: "text",
            textFillColor: "transparent",
          }}
        >
          {children}
        </span>
        <BorderDetail
          sx={{
            position: "absolute",
            transform: "rotate(-180deg)",
            left: ".4rem",
            bottom: ".4rem",
          }}
        />
      </span>
    </Button>
  )
}
