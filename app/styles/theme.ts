import { Theme } from "theme-ui"

import { base } from "@theme-ui/presets"

export const getGradient = (rgb: string) => {
  /**
   * Split RGB. Example: rgb(226, 217, 211)
   * Then extract only numbers
   */
  const splitted = rgb.split(",").map((raw) => raw.replace(/\D/g, ""))

  return `linear-gradient(225deg, ${rgb} 0%, rgba(${splitted[0]}, ${splitted[1]}, ${splitted[2]}, 0.7) 50%, rgba(${splitted[0]}, ${splitted[1]}, ${splitted[2]}, 0.5) 100%)`
}

/**
 * rgb(84, 42, 147)
 * rgb(247, 183, 125)
 *
 */

const theme: Theme = {
  ...base,
  colors: {
    background: "rgb(24, 19, 19)",
    text: "rgb(226, 217, 211)",
    primary: "rgb(247, 183, 125)",
    primaryGradient: getGradient("rgb(247, 183, 125)"),
    heading: "rgb(226, 217, 211)",
    background2: "#1E1E24",
    backgroundGradient: getGradient("rgb(24, 19, 19)"),
    lightText: "rgba(226, 217, 211, 0.5)",
    malachite: "#0BDA51",

    error: "#B00020",
    success: "#5cb85c",
  },

  sizes: {
    container: "80rem",
  },

  fonts: {
    heading:
      'IBM, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  },

  buttons: {
    primary: {
      display: "flex",
      color: "background",
      background: (theme) => theme.colors?.primaryGradient,
      border: "1px solid transparent",
      transition: "all .125s linear",
      alignItems: "center",
      borderColor: "primary",
      opacity: 1,
      fontWeight: 500,

      "&:not(:disabled):hover": {
        bg: "background",
        borderColor: "primary",
        cursor: "pointer",
        opacity: 0.7,
      },

      "&:disabled": {
        cursor: "not-allowed",
        opacity: 0.7,
      },
    },
    secondary: {
      display: "flex",
      color: "heading",
      background: (theme) => theme.colors?.backgroundGradient,
      border: "1px solid transparent",
      transition: "all .125s linear",
      alignItems: "center",
      borderColor: "heading",
      opacity: 1,
      fontWeight: 500,

      "&:not(:disabled):hover": {
        bg: "background",
        cursor: "pointer",
        opacity: 0.7,
      },

      "&:disabled": {
        cursor: "not-allowed",
        opacity: 0.3,
      },
    },

    /** Button with all styles resetted. Used for accessibility */
    resetted: {
      display: "flex",
      background: "none" /*essential*/,
      border: "none" /*essential*/,
      padding: "0" /*essential*/,
      font: "inherit" /*important as otherwise the text will look slightly different*/,
      color:
        "inherit" /*if you want the span the same colour as the rest of the sentence*/,
      cursor:
        "pointer" /*make sure you add this, but if you really want it to behave like a span you would leave this out*/,
      transition: "all .125s linear",

      "&:not(:disabled):hover": {
        cursor: "pointer",
        opacity: 0.7,
      },

      "&:disabled": {
        cursor: "not-allowed",
        opacity: 0.3,
      },
    },
  },

  links: {
    gameButton: {
      display: "flex",

      /** Start custom styles */
      padding: "0 1.6rem",
      alignSelf: "flex-start",
      justifyContent: "flex-start",
      minWidth: "19.2rem",
      background: "url(/assets/long_button_off.png) center no-repeat",
      backgroundSize: "contain",
      alignItems: "center",
      gap: ".8rem",
      fontWeight: "600",
      minHeight: "4.8rem",

      ":hover": {
        background: "url(/assets/long_button_on.png) center no-repeat",
        backgroundSize: "contain",
      },

      "&:-webkit-any-link": {
        transition: "unset",
      },

      "&:-webkit-any-link:hover": {
        textDecoration: "none!important",
        opacity: 1,
      },
    },
  },

  lineHeights: { body: 1.45 },

  text: {
    heading: {
      color: "heading",
      lineHeight: "body",
      fontSize: "3.2rem",
      fontFamily:
        'IBMBold, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      fontWeight: 900,
    },
    heading2: {
      color: "heading",
      lineHeight: "body",
      fontSize: "2.2rem",
    },
    heading3: {
      lineHeight: "body",
      fontSize: "1.8rem",
    },
    heading4: {
      color: "heading",
      lineHeight: "body",
      fontSize: "1.6rem",
      fontWeight: 600,
    },
    base: {
      color: "text",
      lineHeight: "body",
      fontSize: "1.4rem",
    },
    small: {
      color: "text",
      lineHeight: "body",
      fontSize: "1.2rem",
    },
    xsmall: {
      color: "text",
      lineHeight: "body",
      fontSize: "1rem",
    },
  },

  styles: {
    ...base.styles,

    root: {
      ...base.styles?.root,
      /** Set font-size to 62.5%, so that 1 rem = 10px. */
      fontSize: "62.5%",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      // scrollbarGutter: "stable both-edges",

      body: {
        /** Default text styles */
        fontSize: "1.4rem",
        fontFamily:
          'IBM, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        lineHeight: 1.45,
        minHeight: "100vh",
        color: "text",
        backgroundColor: "background",
        transition: "all .125s linear",
      },

      "#__next, body": {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignSelf: "stretch",
      },

      img: {
        maxWidth: "100%",
        height: "auto",
      },

      p: {
        margin: 0,
      },

      a: {
        transition: "all .125s linear",
        color: "text",

        "&:hover": {
          cursor: "pointer",
          color: "primary",
        },

        "&:-webkit-any-link": {
          color: "text",
          textDecoration: "none",
          transition: "all .125s linear",

          "&:hover": {
            cursor: "pointer",
            textDecoration: "underline",
            opacity: 0.8,
          },
        },
      },
      ul: {
        paddingInlineStart: 0,
      },
    },
  },
}

export default theme
