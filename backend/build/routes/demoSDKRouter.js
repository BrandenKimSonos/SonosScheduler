"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoSDKRouter = void 0;
const express_1 = require("express");
const demoSDKController_1 = require("../controllers/demoSDKController");
exports.demoSDKRouter = () => {
    const router = express_1.Router({ mergeParams: true });
    router.get('/', demoSDKController_1.demoSDKController);
    return router;
};
