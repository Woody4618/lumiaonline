import * as React from "react"
import { Flex, Text } from "theme-ui"

export interface IAppProps {
  value: number
  maxvalue: number
  type: "health" | "mana" | "experience" | "mission"
  level?: number
}

export function ProgressBar(props: IAppProps) {
  const { value, maxvalue, type, level } = props

  const percentage = (value / maxvalue) * 100

  const colorsByType = {
    health:
      percentage < 33
        ? ["#d67a7a", "#af2c2c", "#892222"]
        : percentage >= 33 && percentage < 85
        ? ["#ddbe61", "#b88c08", "#906e06"]
        : ["#5bd65b", "#00af00", "#008900"],
    mana: ["#004aa5", "#003474", "#00326f"],
    experience: ["#c00000", "#c00000", "#000"],
    mission: ["#F7B77D", "#F7B705", "#000"],
  }

  const colors = colorsByType[type]

  return (
    <Flex
      {...(type == "experience"
        ? { title: `${maxvalue - value} experience for next level` }
        : {})}
      sx={{
        flex: "1 auto",
        position: "relative",
        height: "1.2rem",
        borderRadius: "2px",
        backgroundColor: "#292929",
        border: ".5px solid #181818",
      }}
    >
      <Flex
        sx={{
          width: `${percentage}%`,
          transition: "width 1.125s ease-in-out",

          background: `linear-gradient(to bottom, ${colors[0]}, ${colors[1]})`,
          borderTop: `0.5px solid ${colors[2]}`,
          borderBottom: `0.5px solid ${colors[2]}`,
        }}
      >
        <Text
          variant="xsmall"
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            margin: "auto",
            top: 0,
            bottom: 0,
            color: "secondary3",
            fontWeight: "bold",
          }}
        >
          {/* {type !== "experience" ? `${value}/${maxvalue}` : level} */}
        </Text>
      </Flex>
    </Flex>
  )
}
