"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHelloWorldRouter = void 0;
const express_1 = require("express");
const helloWorldController_1 = require("../controllers/helloWorldController");
exports.getHelloWorldRouter = () => {
    const router = express_1.Router({ mergeParams: true });
    router.get('/', helloWorldController_1.helloWorldController);
    return router;
};
