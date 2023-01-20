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
import ReactDataTable, {
  createTheme,
  IDataTableProps,
} from "react-data-table-component"
import { useThemeUI } from "theme-ui"

export function DataTable(props: IDataTableProps<any>) {
  const themeContext = useThemeUI()
  const { theme } = themeContext

  /**
   * @reference https://github.com/jbetancur/react-data-table-component/blob/master/src/DataTable/themes.js
   */
  createTheme("chainquest", {
    text: {
      primary: theme.colors.text,
    },
    background: {
      default: theme.colors.background2,
    },
    divider: {
      default: theme.colors.text,
    },
    sortFocus: {
      default: theme.colors.primary,
    },
    striped: {
      default: theme.colors.background,
      text: theme.colors.text,
    },
  })

  return (
    <ReactDataTable
      sx={{
        header: {
          display: "none",
        },
      }}
      theme="chainquest"
      striped={true}
      {...props}
    />
  )
}
