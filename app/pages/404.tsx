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
import { Layout } from "@/components/Layout/Layout"
import Error from "next/error"
import Head from "next/head"

const styles: { [k: string]: React.CSSProperties } = {
  error: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
    height: "100vh",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  desc: {
    display: "inline-block",
    textAlign: "left",
    lineHeight: "49px",
    height: "49px",
    verticalAlign: "middle",
  },

  h1: {
    display: "inline-block",
    margin: 0,
    marginRight: "20px",
    padding: "0 23px 0 0",
    fontSize: "24px",
    fontWeight: 500,
    verticalAlign: "top",
    lineHeight: "49px",
  },

  h2: {
    fontSize: "14px",
    fontWeight: "normal",
    lineHeight: "49px",
    margin: 0,
    padding: 0,
  },
}

export default function Page() {
  const statusCode = 404
  const title = "This page could not be found"
  return (
    <Layout>
      <Head>
        <title>
          {statusCode
            ? `${statusCode}: ${title}`
            : "Application error: a client-side exception has occurred"}
        </title>
      </Head>
      <div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
                body { margin: 0; color: #000; background: #fff; }
                .next-error-h1 {
                  border-right: 1px solid rgba(0, 0, 0, .3);
                }
                ${`@media (prefers-color-scheme: dark) {
                  body { color: #fff; background: #000; }
                  .next-error-h1 {
                    border-right: 1px solid rgba(255, 255, 255, .3);
                  }
                }`}`,
          }}
        />

        {statusCode ? (
          <h1 className="next-error-h1" style={styles.h1}>
            {statusCode}
          </h1>
        ) : null}

        <div style={styles.desc}>
          <h2 style={styles.h2}>{title}.</h2>
        </div>
      </div>
    </Layout>
  )
}
