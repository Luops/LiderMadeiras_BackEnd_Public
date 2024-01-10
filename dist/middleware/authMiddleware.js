"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/middleware/authMiddleware.ts
var authMiddleware_exports = {};
__export(authMiddleware_exports, {
  authMiddleware: () => authMiddleware
});
module.exports = __toCommonJS(authMiddleware_exports);

// src/services/tokenService.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var secret = "fabrios12361236";
var generateToken = (uuid) => {
  return import_jsonwebtoken.default.sign({ id: uuid }, secret, {
    expiresIn: "3000s",
    header: { alg: "HS256", typ: "JWT" }
  });
};
var verifyToken = (token) => {
  const verified = import_jsonwebtoken.default.verify(token, secret);
  if (verified) {
    return verified;
  }
};
var tokenService_default = {
  generateToken,
  verifyToken
};

// src/middleware/authMiddleware.ts
var authMiddleware = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.json({ message: "N\xE3o autorizado!" }).status(403);
  }
  req.body = tokenService_default.verifyToken(token).id;
  next();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authMiddleware
});
