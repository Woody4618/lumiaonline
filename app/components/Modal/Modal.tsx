/** @jsxImportSource theme-ui */
import * as React from "react"
import { Flex } from "theme-ui"

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
          zIndex: 9,

          "@media (min-width: 768px)": {
            width: "96rem",
          },
        }}
        className={className}
      >
        {children}
      </Flex>
      {/** Background Blur */}
      <div
        onClick={setIsOpen ? () => setIsOpen(false) : null}
        sx={{
          display: isOpen ? "block" : "none",
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
