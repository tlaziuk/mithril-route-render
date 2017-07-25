import {
    expect,
} from "chai";

import {
    spy,
    stub,
} from "sinon";

import {
    Component,
    RouteDefs,
} from "mithril";

import * as m from "mithril/render/hyperscript";

import routeRender from "./index";

describe(routeRender.name, () => {
    it(`should be a function`, () => {
        expect(routeRender).to.be.a(`function`);
    });
    it(`should return Promise`, () => {
        expect(routeRender({ "": () => `` }, "")).to.be.instanceOf(Promise);
    });
    it(`should throw error when no route has been found`, async () => {
        const catchSpy = stub();
        await routeRender({}, "").catch(catchSpy);
        expect(catchSpy.calledOnce).to.be.equal(true, `exception was not thrown`);
        expect(catchSpy.firstCall.args[0]).to.be.instanceOf(Error);
    });
    it(`should render default route`, async () => {
        const view = stub().returns(`test`);
        const cmp = {
            view,
        } as Component<any, any>;
        const routes = {
            "/": cmp,
        } as RouteDefs;
        expect(await routeRender(routes, `non-existing-route`, "/")).to.be.a(`string`);
        expect(await routeRender(routes, `non-existing-route`, "/")).to.be.equal(`test`);
        expect(view.called).to.be.equal(true);
    });
    describe(`paths`, () => {
        it(`should get default params`);
        it(`should get params from hash route`);
        it(`should get params from query route`);
        it(`should get params from hash and query route`);
    });
    describe(`ComponentTypes`, () => {
        it(`should render Component route`);
        it(`should render FactoryComponent route`);
        it(`should render ClassComponent route`);
    });
    describe(`RouteResolver`, () => {
        it(`should the payload have proper 'this' type`);
        it(`should execute onmatch`);
        it(`should execute render`);
        it(`should execute payload before render`);
        it(`should render component from onmatch with route`);
        it(`should render component from onmatch without route`);
    });
});
