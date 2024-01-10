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

// src/middleware/morganMiddleware.ts
var morganMiddleware_exports = {};
__export(morganMiddleware_exports, {
  default: () => morganMiddleware_default
});
module.exports = __toCommonJS(morganMiddleware_exports);
var import_morgan = __toESM(require("morgan"));
var import_config2 = __toESM(require("config"));

// config/logger.ts
var import_winston = __toESM(require("winston"));
var import_config = __toESM(require("config"));
var levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};
var level = () => {
  const env = import_config.default.get("env") || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};
var colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white"
};
import_winston.default.addColors(colors);
var format = import_winston.default.format.combine(
  import_winston.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  // Formato para tempo
  import_winston.default.format.colorize({ all: true }),
  // Ativar as cores
  import_winston.default.format.printf(
    (info) => `${info.timestamp} - ${info.level}: ${info.message}`
    // Formato da mensagem
  )
);
var transports = [
  new import_winston.default.transports.Console(),
  new import_winston.default.transports.File({
    filename: "logs/error.log",
    level: "error"
  }),
  new import_winston.default.transports.File({ filename: "logs/all.log" })
];
var Logger = import_winston.default.createLogger({
  level: level(),
  levels,
  format,
  transports
});
var logger_default = Logger;

// src/middleware/morganMiddleware.ts
var stream = {
  write: (message) => logger_default.http(message)
};
var skip = () => {
  const env = import_config2.default.get("env") || "development";
  return env !== "development";
};
var morganMiddleware = (0, import_morgan.default)(
  ":method :url :status :res[content-lenght] - :response-time ms",
  { stream, skip }
  // sabe como imprimir a mensagem por causa do stream e saben quando por causa do skip (somente quando for development)
);
var morganMiddleware_default = morganMiddleware;
