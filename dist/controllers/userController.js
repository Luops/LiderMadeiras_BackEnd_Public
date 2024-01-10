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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/controllers/userController.ts
var userController_exports = {};
__export(userController_exports, {
  createUser: () => createUser
});
module.exports = __toCommonJS(userController_exports);

// src/models/User.ts
var import_mongoose = require("mongoose");
var userSchema = new import_mongoose.Schema(
  {
    id: { type: String },
    name: { type: String },
    lastName: { type: String },
    age: { type: Number },
    cep: { type: Number },
    email: { type: String },
    password: { type: String },
    role: { type: Number },
    uuid: { type: String }
  },
  {
    timestamps: true
  }
);
var UserModel = (0, import_mongoose.model)("User", userSchema, "users");

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

// src/controllers/userController.ts
var import_bcrypt = __toESM(require("bcrypt"));
var import_uuid = require("uuid");
function createUser(req, res) {
  return __async(this, null, function* () {
    try {
      const data = req.body;
      const salt = import_bcrypt.default.genSaltSync(10);
      const hash = yield import_bcrypt.default.hashSync(data.password, salt);
      data.password = hash;
      data.id;
      data.uuid = (0, import_uuid.v4)();
      const user = yield UserModel.create(data);
      return res.status(201).json(user);
    } catch (e) {
      logger_default.error(`Erro no sistema: ${e.message}`);
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createUser
});
