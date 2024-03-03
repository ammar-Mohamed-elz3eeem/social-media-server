"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./src/server")); // Import your main app from the index file
const port = 9000; // Choose a suitable port
const test_server = server_1.default.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.default = test_server;
