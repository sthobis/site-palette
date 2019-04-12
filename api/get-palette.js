const { parse, URL } = require("url")
const { send, sendError } = require("micro")
const chrome = require("chrome-aws-lambda")
const puppeteer = require("puppeteer-core")
const Vibrant = require("node-vibrant")
const cors = require("micro-cors")()

const isValidUrl = str => {
  try {
      const url = new URL(str);
      return url.hostname.includes('.');
  } catch(e) {
      console.error(e.message);
      return false;
  }
}

const exePath = "./node_modules/puppeteer/.local-chromium/win64-641577/chrome-win/chrome.exe"
const getOptions = async () => {
  return process.env.NOW_REGION === "dev1"
    ? {
        args: [],
        executablePath: exePath,
        headless: true,
    }
    : {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless
    }
}

let _page = null
const getPage = async () => {
  if (_page) {
    return _page
  }
  const browser = await puppeteer.launch(await getOptions())
  _page = await browser.newPage()
  return _page
}

module.exports = cors(async (req, res) => {
  try {
    const { query = {} } = parse(req.url, true)
    const site = query.site

    if (!isValidUrl(site)) {
      throw new Error(`Invalid url ${site}.`)
    }

    const page = await getPage()
    await page.goto(site)
    const file = await page.screenshot({ type: "png" })

    Vibrant.from(file).getPalette((err, swatches) => {
      if (err) throw(err)

      const palette = Object.values(swatches).map(swatch => swatch.getHex())
      send(res, 200, { palette })
    })
  } catch (e) {
    sendError(req, res, e)
  }
})
