"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidityV3Api = void 0;
const BaseApi_1 = require("./BaseApi");
const tool_1 = require("../tool");
let LiquidityV3Api = class LiquidityV3Api {
    constructor() {
        this.baseApi = BaseApi_1.BASE_API;
    }
};
exports.LiquidityV3Api = LiquidityV3Api;
exports.LiquidityV3Api = LiquidityV3Api = __decorate([
    (0, tool_1.CacheKey)("LiquidityV3Api"),
    __metadata("design:paramtypes", [])
], LiquidityV3Api);
