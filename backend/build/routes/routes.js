"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const getHelloWorldRouter_1 = require("./getHelloWorldRouter");
const demoSDKRouter_1 = require("./demoSDKRouter");
exports.routes = () => {
    const apiRouter = express_1.Router({ mergeParams: true });
    apiRouter.use('/', getHelloWorldRouter_1.getHelloWorldRouter());
    apiRouter.use('/', demoSDKRouter_1.demoSDKRouter());
    return apiRouter;
};
