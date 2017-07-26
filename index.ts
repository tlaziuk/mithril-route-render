// tslint:disable-next-line:no-reference
/// <reference path="./types/mithril.d.ts" />

import {
    Attributes,
    ComponentTypes,
    Lifecycle,
    RouteDefs,
    RouteResolver,
} from "mithril";

import * as parseQueryString from "mithril/querystring/parse";

import mithrilRender, {
    isComponentType,
} from "mithril-render";

// code from mithril.js internal method
function parsePath(
    path: string,
    queryData?: { [_: string]: any },
    hashData?: { [_: string]: any },
): string {
    const queryIndex = path.indexOf("?");
    const hashIndex = path.indexOf("#");
    const pathEnd = queryIndex > -1 ? queryIndex : hashIndex > -1 ? hashIndex : path.length;
    if ((queryIndex > -1) && (typeof queryData !== "undefined")) {
        const queryEnd = hashIndex > -1 ? hashIndex : path.length;
        const queryParams = parseQueryString(path.slice(queryIndex + 1, queryEnd));
        // tslint:disable-next-line:forin
        for (const key in queryParams) {
            queryData[key] = queryParams[key];
        }
    }
    if ((hashIndex > -1) && (typeof hashData !== "undefined")) {
        const hashParams = parseQueryString(path.slice(hashIndex + 1));
        // tslint:disable-next-line:forin
        for (const key in hashParams) {
            hashData[key] = hashParams[key];
        }
    }
    return path.slice(0, pathEnd);
}

function isRouteResolver(thing: any): thing is RouteResolver<Attributes, Lifecycle<Attributes, {}>> {
    return thing && [typeof thing.onmatch, typeof thing.render].indexOf("function") >= 0;
}

export async function routeRender(
    routes: RouteDefs,
    path: string,
    defaultPath: string = path,
    params: { [_: string]: any } = {},
): Promise<string> {
    const pathname = parsePath(path, params, params);
    // tslint:disable-next-line:forin
    for (const route in routes) {
        const matcher = new RegExp(
            `^${route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)")}\/?$`,
        );
        const matchArr = pathname.match(matcher);
        if (matchArr !== null) {
            const keys = route.match(/:[^\/]+/g) || [];
            const [match, ...values] = matchArr;
            // tslint:disable-next-line:forin
            for (const i in keys) {
                const key = keys[i];
                const value = values[i];
                params[key.replace(/:|\./g, "")] = decodeURIComponent(value);
            }
            const payload = routes[route];
            // tslint:disable-next-line:whitespace
            const m = await import("mithril/render/hyperscript");
            if (isComponentType(payload)) {
                return await mithrilRender(m(payload, params));
            } else if (isRouteResolver(payload)) {
                let component: ComponentTypes<any, any> = undefined as any;
                if (typeof payload.onmatch === "function") {
                    const cmp = await payload.onmatch(params, path);
                    if (isComponentType(cmp)) {
                        component = cmp;
                    }
                }
                if (typeof payload.render === "function") {
                    return await mithrilRender(payload.render(m(component || "div", params)));
                } else {
                    return await mithrilRender(component, { attrs: params });
                }
            } else {
                throw new Error(`Could not resolve payload '${payload}'`);
            }
        }
    }
    if (path !== defaultPath) {
        return await routeRender(routes, defaultPath, defaultPath, params);
    }
    throw new Error(`Could not resolve route '${path}'`);
}

export default routeRender;
