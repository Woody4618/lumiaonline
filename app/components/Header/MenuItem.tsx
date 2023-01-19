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
import Link from "next/link"
import { Button, Flex } from "theme-ui"

export const MenuItem = ({
  icon,
  href,
}: {
  icon: React.ReactNode | React.ReactNode[]
  href: string
}) => {
  return (
    <Flex
      sx={{
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "stretch",

        "&:hover": {
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: "text",
        },
      }}
    >
      <Link href={href}>
        <Button variant="resetted">{icon}</Button>
      </Link>
    </Flex>
  )
}
