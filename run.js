"use strict";
/*****************************************************/
/*          LUNA WILL INCORPORATE ELECTRON           */
/*          MOST OF THAT WILL END UP HERE            */
/*****************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luna_js_1 = __importDefault(require("./core/luna.js"));
let luna = new luna_js_1.default();
luna.wake_up();
