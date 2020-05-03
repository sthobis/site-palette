import { URL } from "url";
import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import Vibrant from "node-vibrant";

const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
async function getOptions() {
  let options;
  if (process.env.NODE_ENV === "development") {
    options = {
      args: [],
      executablePath: exePath,
      headless: true,
    };
  } else {
    options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    };
  }
  return options;
}

function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.hostname.includes(".");
  } catch (e) {
    console.error(e.message);
    return false;
  }
}

let _page = null;
async function getPage() {
  if (_page) {
    return _page;
  }
  const browser = await puppeteer.launch(await getOptions());
  _page = await browser.newPage();
  return _page;
}

async function getScreenshot(url) {
  const page = await getPage();
  await page.goto(url);
  return await page.screenshot({ type: "png" });
}

async function getPalette(file) {
  return new Promise((resolve, reject) => {
    Vibrant.from(file).getPalette((err, swatches) => {
      if (err) {
        reject(err);
      }

      const palette = Object.values(swatches).map((swatch) => swatch.getHex());
      resolve(palette);
    });
  });
}

export default async (req, res) => {
  try {
    const { site } = req.query;

    if (!isValidUrl(site)) {
      throw new Error(`Invalid url ${site}.`);
    }

    const file = await getScreenshot(site);
    const palette = await getPalette(file);
    res.status(200).json({ palette });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
};
