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
