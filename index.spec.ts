import {
    expect,
} from "chai";

import {
    SinonSpy,
    spy,
    stub,
} from "sinon";

import {
    ClassComponent,
    Component,
    FactoryComponent,
    RouteDefs,
    RouteResolver,
    Vnode,
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
        it(`should render Component route`, async () => {
            const view = spy(() => `test`) as Component<any, any>["view"] & SinonSpy;
            const cmp = {
                view,
            } as Component<any, any>;
            const routes = {
                "/": cmp,
            } as RouteDefs;
            expect(await routeRender(routes, "/")).to.be.a("string");
            expect(view.called).to.be.equal(true);
            expect(view.firstCall.args[0]).to.be.a("object");
        });
        it(`should render FactoryComponent route`, async () => {
            const view = spy(() => `test`) as Component<any, any>["view"] & SinonSpy;
            const cmp = () => {
                return {
                    view,
                } as Component<any, any>;
            };
            const routes = {
                "/": cmp,
            } as RouteDefs;
            expect(await routeRender(routes, "/")).to.be.a("string");
            expect(view.called).to.be.equal(true);
            expect(view.firstCall.args[0]).to.be.a("object");
        });
        it(`should render ClassComponent route`, async () => {
            const view = spy(() => `test`) as ClassComponent<any>["view"] & SinonSpy;
            // tslint:disable-next-line:class-name
            class cmp implements ClassComponent<any> {
                public view: any;
            }
            cmp.prototype.view = view;
            const routes = {
                "/": cmp,
            } as RouteDefs;
            expect(await routeRender(routes, "/")).to.be.a("string");
            expect(view.called).to.be.equal(true);
            expect(view.firstCall.args[0]).to.be.a("object");
        });
    });
    describe(`RouteResolver`, () => {
        let view: Component<any, any>["view"] & SinonSpy;
        let onmatch: RouteResolver<any, any>["onmatch"] & SinonSpy;
        let onmatchVoid: RouteResolver<any, any>["onmatch"] & SinonSpy;
        let render: RouteResolver<any, any>["render"] & SinonSpy;
        let resolver: RouteResolver<any, any>;
        let resolverVoid: RouteResolver<any, any>;
        let resolverOnmatch: RouteResolver<any, any>;
        let resolverOnmatchVoid: RouteResolver<any, any>;
        let resolverRender: RouteResolver<any, any>;
        let resolverEmpty: RouteResolver<any, any>;
        let cmp: Component<any, any>;
        let routes: RouteDefs;
        beforeEach(() => {
            view = spy(() => `test`);
            cmp = {
                view,
            };
            onmatch = spy(async (args: any, path: string) => await cmp);
            onmatchVoid = spy(async (args: any, path: string) => await undefined);
            render = spy((vnode: Vnode<any, any>) => vnode);
            resolver = {
                onmatch,
                render,
            };
            resolverVoid = {
                onmatch: onmatchVoid,
                render,
            };
            resolverOnmatch = {
                onmatch,
            };
            resolverOnmatchVoid = {
                onmatch: onmatchVoid,
            };
            resolverRender = {
                render,
            };
            resolverEmpty = {};
            // tslint:disable:object-literal-sort-keys
            routes = {
                "/": resolver,
                "/empty": resolverEmpty,
                "/onmatch": resolverOnmatch,
                "/onmatch-void": resolverOnmatchVoid,
                "/render": resolverRender,
                "/void": resolverVoid,
                "/:test": resolver,
                "/:test...": resolver,
            };
            // tslint:enable:object-literal-sort-keys
        });
        it(`should execute onmatch`, async () => {
            await routeRender(routes, "/onmatch");
            expect(onmatch.called).to.be.equal(true);
        });
        it(`should execute render`, async () => {
            await routeRender(routes, "/render");
            expect(render.called).to.be.equal(true);
        });
        it(`should execute payload before render`, async () => {
            await routeRender(routes, "/");
            expect(onmatch.called).to.be.equal(true);
            expect(render.called).to.be.equal(true);
            expect(onmatch.calledBefore(render)).to.be.equal(true);
        });
        it(`should render component from onmatch with render`, async () => {
            expect(await routeRender(routes, "/")).to.be.a("string");
            expect(onmatch.called).to.be.equal(true);
            expect(render.called).to.be.equal(true);
        });
        it(`should render component from onmatch without render`, async () => {
            expect(await routeRender(routes, "/onmatch")).to.be.a("string");
            expect(onmatch.called).to.be.equal(true);
            expect(render.called).to.be.equal(false);
        });
        it(`should render void onmatch with render`, async () => {
            expect(await routeRender(routes, "/void")).to.be.a("string");
            expect(onmatchVoid.called).to.be.equal(true);
            expect(render.called).to.be.equal(true);
        });
        it(`should render void onmatch without render`, async () => {
            expect(await routeRender(routes, "/onmatch-void")).to.be.a("string").equal("");
            expect(onmatchVoid.called).to.be.equal(true);
            expect(render.called).to.be.equal(false);
        });
        it(`should render empty payload throw an Error`, async () => {
            const catchSpy = spy();
            await routeRender(routes, "/empty").catch(catchSpy);
            expect(catchSpy.called).to.be.equal(true);
            expect(catchSpy.firstCall.args[0]).to.be.instanceOf(Error);
        });
        it(`should render component from onmatch without render`, async () => {
            expect(await routeRender(routes, "/onmatch")).to.be.a("string");
            expect(onmatch.called).to.be.equal(true);
            expect(render.called).to.be.equal(false);
        });
        it(`should the payload have proper 'this' type`, async () => {
            await routeRender(routes, "/");
            expect(onmatch.firstCall.thisValue).to.be.equal(resolver);
            expect(render.firstCall.thisValue).to.be.equal(resolver);
            (resolver as any).test = `test`;
            expect(onmatch.firstCall.thisValue).to.have.property("test").equal(`test`);
            expect(render.firstCall.thisValue).to.have.property("test").equal(`test`);
        });
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
            expect(onmatch.firstCall.args[1]).to.be.equal("/resolver");
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
        it(`should RouteResolver get params from variadic route, hash and query`, async () => {
            await routeRender(routes, "/resolver/abc/def?query=val#hash=val");
            expect(onmatch.firstCall.args[0]).to.be.eql({ test: "abc/def", query: "val", hash: "val" });
            expect(onmatch.firstCall.args[0]).to.be.eql({ test: "abc/def", query: "val", hash: "val" });
            expect(onmatch.firstCall.args[1]).to.be.equal("/resolver/abc/def?query=val#hash=val");
        });
    });
});
