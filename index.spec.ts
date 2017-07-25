import {
    expect,
} from "chai";

import {
    spy,
    stub,
    SinonSpy,
} from "sinon";

import {
    Component,
    RouteDefs,
    RouteResolver,
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
        expect(catchSpy.firstCall.args[0]).to.be.instanceOf(Error, `not an Error instance was thrown`);
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
    describe(`paths`, () => {
        let view: Component<any, any>["view"] & SinonSpy;
        let onmatch: RouteResolver<any, any>["onmatch"] & SinonSpy;
        let render: RouteResolver<any, any>["render"] & SinonSpy;
        let resolver: RouteResolver<any, any>;
        let cmp: Component<any, any>;
        let routes: RouteDefs;
        beforeEach(() => {
            view = spy();
            onmatch = spy();
            render = spy();
            cmp = {
                view,
            };
            resolver = {
                onmatch,
                render,
            };
            routes = {
                "/": cmp,
                "/cmp": cmp,
                "/cmp/:test": cmp,
                "/cmp/:test...": cmp,
                "/resolver": resolver,
                "/resolver/:test": resolver,
                "/resolver/:test...": resolver,
            };
        });
        it(`should ComponentTypes get default params`, async () => {
            const attrs = {
                attr: `test`,
            };
            await routeRender(routes, "/cmp", void 0, attrs);
            expect(view.firstCall.args[0].attrs).to.be.equal(attrs);
        });
        it(`should RouteResolver get default params`, async () => {
            const attrs = {
                attr: `test`,
            };
            await routeRender(routes, "/resolver", void 0, attrs);
            expect(onmatch.firstCall.args[0]).to.be.equal(attrs);
            expect(render.firstCall.args[0].attrs).to.be.equal(attrs);
        });
        it(`should get params from hash route`, async () => {
            await routeRender(routes, "/cmp#attr=val");
            expect(view.firstCall.args[0].attrs).to.be.eql({ attr: "val" });
        });
        it(`should get params from query route`, async () => {
            await routeRender(routes, "/cmp?attr=val");
            expect(view.firstCall.args[0].attrs).to.be.eql({ attr: "val" });
        });
        it(`should get params from hash and query route`, async () => {
            await routeRender(routes, "/cmp?attr1=val#attr2=val");
            expect(view.firstCall.args[0].attrs).to.be.eql({ attr1: "val", attr2: "val" });
        });
        it(`should get params from route`, async () => {
            await routeRender(routes, "/cmp/val");
            expect(view.firstCall.args[0].attrs).to.be.eql({ test: "val" });
        });
        it(`should get params from variadic route`, async () => {
            await routeRender(routes, "/cmp/val/val");
            expect(view.firstCall.args[0].attrs).to.be.eql({ test: "val/val" });
        });
    });
});
