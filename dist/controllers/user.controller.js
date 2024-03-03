"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logUserOut = exports.addNewUser = exports.authenticateUser = exports.updateUserPassword = exports.updateUser = exports.getUser = exports.deleteUser = exports.getAllUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const uploader_1 = __importDefault(require("../utils/uploader"));
const auth_1 = __importDefault(require("../config/auth"));
const uploader_2 = __importDefault(require("../config/uploader"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.findAll();
        if (!users) {
            return res.status(204).json({ message: 'No Users found' });
        }
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getAllUsers = getAllUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.id) {
        return res.status(400).json({ message: 'User id required.' });
    }
    try {
        const user = yield user_model_1.default.findOne({ where: { id: req.body.id } });
        if (!user) {
            return res.status(204).json({ message: `User ID ${req.body.id} not found` });
        }
        const result = yield user_model_1.default.delete(req.body.id);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.deleteUser = deleteUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        return res.status(400).json({ message: 'User id required.' });
    }
    try {
        const user = yield user_model_1.default.findOne({ where: { id: req.params.id } });
        if (!user) {
            return res.status(404).json({ message: `User ID ${req.params.id} not found` });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const avatar_url = req.file;
    let avatar;
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        if (avatar_url) {
            avatar = yield (0, uploader_1.default)(avatar_url, uploader_2.default.avatars_path, true);
        }
        delete req.body['avatar_url'];
        if (avatar) {
            const updatedUser = yield user_model_1.default.update(Object.assign(Object.assign({}, req.body), { avatar_url: avatar }), {
                where: { id: req.user }
            });
        }
        else {
            const updatedUser = yield user_model_1.default.update(Object.assign({}, req.body), {
                where: { id: req.user }
            });
        }
        res.status(200).json({ message: 'User updated successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.updateUser = updateUser;
const updateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { old_password, new_password, confirm_new_password } = req.body;
    if (!old_password || !new_password || !confirm_new_password) {
        return res.status(400).json({ message: 'all fields are required' });
    }
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (new_password !== confirm_new_password) {
        return res.status(400).json({ message: 'password & confirm password must be identical' });
    }
    const user = yield user_model_1.default.findOne({ where: { id: req.user } });
    if (!user) {
        return res.status(400).json({ message: 'user not found' });
    }
    if (!bcrypt_1.default.compareSync(old_password + process.env.BCRYPT_SALT, user.password)) {
        return res.status(400).json({ message: 'old password is wrong' });
    }
    try {
        const hashNewPassword = yield bcrypt_1.default.hash(new_password + process.env.BCRYPT_SALT, 10);
        const updatedUser = yield user_model_1.default.updatePassword(hashNewPassword, {
            where: { id: req.user }
        });
        res.status(200).json({ message: 'password updated successfully' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});
exports.updateUserPassword = updateUserPassword;
const authenticateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ 'message': 'email and password are required.' });
    }
    try {
        const user = yield user_model_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }
        console.log(password + process.env.BCRYPT_SALT);
        console.log(bcrypt_1.default.compareSync(password + process.env.BCRYPT_SALT, user.password));
        const match = yield bcrypt_1.default.compare(password + process.env.BCRYPT_SALT, user.password);
        if (!match) {
            return res.status(403).json({ message: 'Invalid Credentials' });
        }
        const accessToken = jsonwebtoken_1.default.sign({ email: user.email, id: user.id }, auth_1.default.access_secret, {
            expiresIn: auth_1.default.jwt_exrpiration
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, auth_1.default.refresh_secret, {
            expiresIn: auth_1.default.refresh_expiration
        });
        const result = yield user_model_1.default.updateRefreshToken(refreshToken, { where: { id: user.id } });
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        delete user['password'];
        delete user['refresh_token'];
        return res.status(200).json({ accessToken, refreshToken, user_info: Object.assign({}, user) });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.authenticateUser = authenticateUser;
const addNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, username, email, password, dob, phone, confirm_password } = req.body;
    if (!username || !password || !email || !first_name || !last_name) {
        return res.status(400).json({ 'message': 'All Fields marked with * are required.' });
    }
    if (password !== confirm_password) {
        // console.log(password, confirm_password);
        return res.status(400).json({ 'message': 'Password & confirm password Fields must be identical' });
    }
    const duplicate = yield user_model_1.default.findOne({ where: { username: username } });
    if (duplicate) {
        return res.status(409).json({ message: 'User Already Exist' }); //Conflict
    }
    try {
        const hashedPW = yield bcrypt_1.default.hash(password + process.env.BCRYPT_SALT, 10);
        const result = yield user_model_1.default.create({ first_name, last_name, username, email, password: hashedPW, dob, phone });
        return res.status(201).json({ message: 'User ' + username + ' Created successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
});
exports.addNewUser = addNewUser;
const logUserOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    console.log(req.cookies);
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) {
        return res.status(200).json({ message: 'Loged out successfully', error: null });
    }
    try {
        const refreshToken = cookies.jwt;
        const user = yield user_model_1.default.findOne({ where: { refresh_token: refreshToken } });
        if (!user) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'none' });
            return res.status(200).json({ message: 'Loged out successfully' });
        }
        const result = yield user_model_1.default.updateRefreshToken('', { where: { id: user.id } });
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none' });
        return res.status(200).json({ message: 'Loged out successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.logUserOut = logUserOut;
