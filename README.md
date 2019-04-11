# Monorepo

In this example we will be deploying a simple but complete `Monorepo` that will poll and display the time using a set of different programming languages like GoLang, PHP, Node.js, Python and even a Next.js application on the same repository.

### Getting started with Monorepo

We will start by creating two main folders `api` which will contain all our server code using different programming languages and `www` will contain our Next.js application that will consume all the data from our API.

### Creating our API code

- Let's start by creating a file named `api/go/index.go` and add the following GoLang code:

```go
package main

import (
	"fmt"
	"net/http"
	"time"
)

func Time(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, time.Now().Format(time.RFC1123Z))
}
```

- Now we will create a file named `api/node/index.js` and add the following JavaScript code:

```js
module.exports = (req, res) => {
  res.end(new Date().toString());
};
```

- We will do the same for PHP creating a file named `api/php/index.php` with the following code:

```php
<?php echo date("r")?>
```

- And lastly let's create a file named `api/python/index.py` with the following Python code:

```python
import datetime
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','text/plain')
        self.end_headers()
        self.wfile.write(str(datetime.datetime.now()).encode())
        return
```

### Creating our www code

- First we will create our `www` folder and add a `package.json` file including `isomorphic-unfetch` in our dependencies:

```json
{
  "name": "monorepo",
  "dependencies": {
    "isomorphic-unfetch": "3.0.0"
  }
}
```

- Next inside the same folder let's create a `pages` folder with an `index.js` file with the following code:

```jsx
import Time from '../components/time'
import 'isomorphic-unfetch'

const langs = [
  { name: 'Go', path: 'go', ext: '.go' },
  { name: 'Python', path: 'python', ext: '.py' },
  { name: 'PHP', path: 'php', ext: '.php' },
  { name: 'Node.js', path: 'node', ext: '.js' }
]

const Page = ({nows}) => <div className="container">
    <div className="logo">
      <svg width={40} height={36}>
        <path
          d="M20 .1L.1 35.8h39.7L20 0zm-1.7 7.2l14.5 26.4H3.6L18.3 7.3z"
          fill="#fff"
          fillRule="nonzero"
        />
      </svg>
    </div>
    <div className="clocks">
      {nows.map(({name, path, ext, now}) =>
        <a href={`https://zeit.co/now-examples/monorepo/4csp3st7w/source?f=src/${path}/index${ext}`} target="_blank" title={name} key={path}>
          <Time
            name={name}
            path={path}
            now={now}
          />
        </a>
      )}
    </div>
    <div className="intro">
      <hr/>
      <h2>What is this?</h2>
      <p>We built this deployment to showcase the power and flexibility of <a href="https://zeit.co/blog/now-2" target="_blank">Now 2.0</a>. It's organized as a monorepo that combines multiple technologies.</p>
      <p>The entrypoint to this deployment is a Next.js application, compiled to serverless functions that server-render on-demand.</p>
      <p>Thanks to our <a href="https://zeit.co/docs/v2/deployments/builders/overview" title="builders" target="_blank">builders</a>, you are not limited to just static or dynamic, Go or Node.js. The possibilities are endless.</p>
    </div>
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }
      html, body {
        height: 100%;
      }
      body {
        margin: 0;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing:grayscale;
        background: radial-gradient(circle, #333, #333 1px, #000 1px, #000);
        background-size: 28px 28px;
        background-position: center;
        font-size: 18px;
        line-height: 1.6;
        font-weight: 400;
      }
      a {
        text-decoration: none;
        color: white;
      }
      strong {
        color: white;
        font-weight: 600;
      }
      code {
        font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
        font-size: 0.9em;
      }
      code::before,
      code::after {
        content: '\`';
      }
      ::selection{ background: #f81ce5; color: white; }
      ::-moz-selection{ background: #f81ce5; color: white; }
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        max-width: 100%;
        width: 1080px;
        min-height: 100vh;
        margin: auto;
        padding: 30px 20px;
      }
      .logo {
        margin: 30px 0 20px;
      }
      .intro {
        text-align: left;
        max-width: 640px;
      }
      .intro a {
        margin-right: .15em;
        border-bottom: 1px solid;
      }
      h2 {
        font-size: 30px;
      }
      hr {
        display: none;
        border: none;
        border-bottom: 1px solid #666;
        width: 100px;
        margin: 30px 0;
      }
      .clocks {
        display: flex;
        flex-wrap: wrap;
        flex: 1;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin: 0 -10px;
        padding: 40px 0;
        max-height: 500px;
      }
      .clocks a {
        position: relative;
        flex: 1 0 25%;
        text-align: center;
        padding: 10px;
        margin: 20px 0;
        font-size: 17px;
        transition: all .1s ease;
      }
      .clocks a:hover {
        box-shadow: 0 0 0 1px #666;
      }
      .clock span {
        font-weight: 700;
      }
      .clock time {
        display: block;
        height: 3.2em;
        font-weight: 700;
        color: #fff;
        animation: pulse 1s forwards;
      }
      @keyframes pulse {
        from {
          color: #fff;
        }
        to {
          color: #bbb;
        }
      }
      @media screen and (max-width: 960px) {
        .clocks a {
          flex: 1 0 50%;
          font-size: 20px;
        }
      }
      @media screen and (max-width: 480px) {
        .clocks a {
          flex: 1 0 100%;
        }
        .clocks {
          max-height: unset;
        }
        hr {
          display: block;
        }
      }
    `}</style>
  </div>

Page.getInitialProps = async ({req}) => {
  const baseUrl = `https://${req.headers.host}/api`
  const nows = await Promise.all(langs.map(async ({name, path, ext}) => {
    const now = await (await fetch(`${baseUrl}/${path}`)).text()
    return {name, path, now, ext}
  }))

  return { nows }
}

export default Page
```

- As you might noticed we have a component called `time.js`, lets create that one now. Create a folder named `components` with a file named `time.js` on it and add the following code:

```jsx
import React from 'react'
import 'isomorphic-unfetch'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      now: props.now
    }
  }

  componentDidMount() {
    const { path } = this.props
    const url = `${location.href}api/${path}`

    const update = async () => {
      try {
        const res = await fetch(url)
        if (res.ok) {
          const now = (await res.text()).trim()
          if (now !== this.state.now) {
            this.setState({now})
          }
        } else {
          console.log(`res not ok from ${url}`)
        }
      } catch (err) {
        console.error(`Could not fetch time from ${url}`)
      }
      this.timeout = setTimeout(update, 1000)
    }

    this.timeout = setTimeout(update, 1000)
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render () {
    const { name } = this.props
    const { now } = this.state
    return (
      <div className="clock">
        The current time,<br/> according to <span>{name}</span>, is: <time key={now}>{now}</time>
      </div>
    )
  }
}

```

### Summary

By now, your folder tree should look like this:

```
- api
    - go
        - index.go
    - node
        - index.js
    - php
        - index.php
    - python
        - index.py
- www
    - components
        - time.js
    - pages
        index.js
    - package.json
```

### Deploy with Now

First we need to create a `now.json` configuration file to instruct Now how to build the project.

For this example we will be using our newest version [Now 2.0](https://zeit.co/now).

By adding the `version` key to the `now.json` file, we can specify which Now Platform version to use.

We also need to define each builders we would like to use. [Builders](https://zeit.co/docs/v2/deployments/builders/overview/) are modules that take a deployment's source and return an output, consisting of [either static files or dynamic Lambdas](https://zeit.co/docs/v2/deployments/builds/#sources-and-outputs).

In this case we are going to use `@now/go` to build and deploy the all GoLang files, `@now/node` to build and deploy the all JavasScript files, `@now/php` to build and deploy the all PHP files, `@now/python` to build and deploy the all Python files, and finally `@now/next` to build and deploy the our Next.js application. We will also define a name for our project (optional).

Next, we will add a routes key, which will handle routing for our Monorepo; pointing the contents from `www` to our webroot `/` and the contents from `api` to `/api`.

```json
{
    "version": 2,
    "name": "monorepo",
    "builds": [
        { "src": "www/package.json", "use": "@now/next" },
        { "src": "api/go/*.go", "use": "@now/go" },
        { "src": "api/python/*.py", "use": "@now/python" },
        { "src": "api/php/*.php", "use": "@now/php" },
        { "src": "api/node/*.js", "use": "@now/node" }
    ],
    "routes": [
        { "src": "/api/(.*)", "dest": "/api/$1" },
        { "src": "/(.*)", "dest": "/www/$1" }
    ]
}
```

Visit our [documentation](https://zeit.co/docs/v2/deployments/configuration) for more information on the `now.json` configuration file.

We are now ready to deploy the app.

```
now
```
