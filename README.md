# mithril-route-render

[![Build Status](https://travis-ci.org/tlaziuk/mithril-route-render.svg?branch=master)](https://travis-ci.org/tlaziuk/mithril-route-render)
[![Coverage Status](https://coveralls.io/repos/github/tlaziuk/mithril-route-render/badge.svg?branch=master)](https://coveralls.io/github/tlaziuk/mithril-route-render?branch=master)
[![dependencies Status](https://david-dm.org/tlaziuk/mithril-route-render/status.svg)](https://david-dm.org/tlaziuk/mithril-route-render)
[![devDependencies Status](https://david-dm.org/tlaziuk/mithril-route-render/dev-status.svg)](https://david-dm.org/tlaziuk/mithril-route-render?type=dev)
[![peerDependencies Status](https://david-dm.org/tlaziuk/mithril-route-render/peer-status.svg)](https://david-dm.org/tlaziuk/mithril-route-render?type=peer)
[![npm version](https://badge.fury.io/js/mithril-route-render.svg)](https://badge.fury.io/js/mithril-route-render)
[![downloads](https://img.shields.io/npm/dm/mithril-route-render.svg)](https://www.npmjs.com/package/mithril-route-render)
[![license](https://img.shields.io/npm/l/mithril-route-render.svg)](https://www.npmjs.com/package/mithril-route-render)

use mithril routes with express

## installation

``` sh
npm install mithril-route-render
```

## usage

``` typescript
import routeRender from "mithril-route-render";

import * as browserMock from "mithril/test-utils/browserMock";

// use a mock DOM so we can run mithril on the server
browserMock(global);

import routes from "./your-mithril-routes";

routeRender(routes, "/route", "/default-route").then((partialHtml) => {
    console.log(partialHtml);
});
```

## see also

* [mithril.js](https://github.com/MithrilJS/mithril.js) to get know what is mithril
* [mithril-render](https://github.com/tlaziuk/mithril-render) to see what's behind the hood
