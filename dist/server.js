"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVATAR_PATH = exports.UPLOAD_PATH = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const logger_middleware_1 = __importDefault(require("./middlewares/logger.middleware"));
const credentials_middleware_1 = __importDefault(require("./middlewares/credentials.middleware"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const cors_2 = __importDefault(require("./config/cors"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const logout_route_1 = __importDefault(require("./routes/logout.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const image_route_1 = __importDefault(require("./routes/image.route"));
const app = (0, express_1.default)();
const PORT = Number(process.env.SERVER_PORT) || 3535;
exports.UPLOAD_PATH = path_1.default.join(__dirname, "..", "uploads");
exports.AVATAR_PATH = path_1.default.join(__dirname, "..", "avatars");
app.use(logger_middleware_1.default);
app.use(credentials_middleware_1.default);
app.use((0, cors_1.default)(cors_2.default));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
app.use("/users", user_route_1.default);
app.use("/login", auth_route_1.default);
app.use("/logout", logout_route_1.default);
app.use("/posts", post_route_1.default);
app.use("/images", image_route_1.default);
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to Friendy Server" });
});
app.all("*", (req, res) => {
    res.status(404).json({ message: '404 Not Found' });
});
app.use(error_middleware_1.default);
if (process.env.TEST_ENV) {
    app.listen(PORT, () => {
        console.log('app is running on port: ', PORT);
    });
}
exports.default = app;
