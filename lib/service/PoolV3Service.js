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
exports.PoolV3Service = void 0;
const tool_1 = require("./tool");
const BaseService_1 = require("./BaseService");
const ConnectInfo_1 = require("../ConnectInfo");
let PoolV3Service = class PoolV3Service extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
    }
};
exports.PoolV3Service = PoolV3Service;
exports.PoolV3Service = PoolV3Service = __decorate([
    (0, tool_1.CacheKey)('PoolV3Service'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], PoolV3Service);
