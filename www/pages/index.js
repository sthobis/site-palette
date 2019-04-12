import React, { useState, useEffect } from "react"
import Head from "next/head"
import "isomorphic-unfetch"

const Page = ({ site: initialSite, api }) => {
  const [site, setSite] = useState(initialSite)
  const [palette, setPalette] = useState(null)
  const [isFetching, setIsFetching] = useState(false)
  
  const getSitePalette = async (e) => {
    e && e.preventDefault()
    setIsFetching(true)

    const res = (await (await fetch(`${api}/?site=${site}`)).json())

    setPalette(res.palette)
    setIsFetching(false)
  }

  useEffect(() => {
    if (site) {
      getSitePalette()
    }
  }, [])

  return (
    <div className="container">
      <Head>
        <title>Site Palette {site && `for ${site}`}</title>
        <link rel="icon" type="image/png" href="/static/icon.png" />
        <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet" />
      </Head>
      <form onSubmit={getSitePalette}>
        <input
          value={site}
          onChange={e => setSite(e.target.value)}
          placeholder="https://sthobis.github.io"
          disabled={isFetching}
        />
        <button disabled={isFetching}>
          {
            isFetching ? (
              <div className="spinner" />
            ) : "Get Palette"
          }
        </button>
      </form>
      {
        palette && (
          <ul className="palette">
            {
              Object.values(palette).map((color, i) => (
                <li
                  key={i}
                  className="color"
                >
                  <div
                    className="thumbnail"
                    style={{
                      backgroundColor: color
                    }}
                  />
                  {color}
                </li>
              ))
            }
          </ul>
        )
      }
      <p>Made by <a href="https://github.com/sthobis">@sthobis</a>. Source available on <a href="https://github.com/sthobis/site-palette">github</a>.</p>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          color: #111;
          margin: 0;
          font-size: 18px;
          font-family: "Source Sans Pro", sans-serif;
        }

        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 700px;
          min-height: 100vh;
          margin: 0 auto;
          padding: 40px;
        }

        form {
          display: flex;
          align-items: stretch;
          width: 100%;
          margin-bottom: 50px;
        }

        input {
          flex: 1 1 100%;
          padding: 10px 20px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 18px;
          font-family: "Source Sans Pro", sans-serif;
          margin-right: 20px;
        }

        button {
          flex-grow: 0;
          flex-shrink: 0;
          width: 120px;
          padding: 4px 20px;
          color: #fff;
          background: #111;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          font-family: "Source Sans Pro", sans-serif;
          text-align: center;
          text-transform: uppercase;
          cursor: pointer;
        }

        ul {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          margin: 0 0 20px 0;
          padding: 0;
          list-style-type: none;
          width: 100%;
        }

        .color {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          margin: 0 20px 20px 0;
        }

        .color:last-child {
          margin-right: 0;
        }

        .thumbnail {
          width: 80px;
          height: 80px;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        p {
          font-size: 16px;
          margin: 0 0 50px 0;
          text-align: center;
        }

        a {
          position: relative;
          color: #111;
          text-decoration: none;
          padding: 0 4px;
        }

        a::before {
          content: "";
          position: absolute;
          bottom: 2px;
          left: 0;
          display: block;
          width: 100%;
          height: 4px;
          background-color: rgba(0, 0, 0, 0.2);
          transform: rotate(-5deg) skew(-40deg);
          transition: .3s;
          z-index: -1;
        }

        a:visited {
          color: initial;
        }

        a:hover::before {
          background-color: rgba(255, 0, 0, 0.2);
        }

        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease infinite;
        }

        @keyframes spin {
          to { -webkit-transform: rotate(360deg); }
        }

        @media (max-width: 767px) {
          form {
            flex-direction: column;
          }

          input {
            width: 100%;
            margin-right: 0;
            margin-bottom: 20px;
          }

          button {
            width: 100%;
            height: 45px;
          }

          ul {
            justify-content: space-between;
          }

          .color {
            width: calc((100% - 40px) / 3);
          }

          .color:nth-child(3n) {
            margin-right: 0;
          }
        }
      `}</style>
    </div>
  )
}

Page.getInitialProps = async ({ req, query }) => {
  const protocol = process.env.NOW_REGION === "dev1" ? "http" : "https"
  const host = process.env.NOW_REGION === "dev1" ? "localhost:3001" : req.headers.host
  const api = `${protocol}://${host}/api/get-palette.js`

  return {
    site: query.site || "",
    api
  }
}

export default Page
