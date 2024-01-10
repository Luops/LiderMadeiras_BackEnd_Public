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

// src/services/userServices.ts
var userServices_exports = {};
__export(userServices_exports, {
  findUserById: () => findUserById,
  login: () => login,
  setCookie: () => setCookie
});
module.exports = __toCommonJS(userServices_exports);

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

// src/services/userServices.ts
var import_cookie = require("cookie");
var import_bcrypt = __toESM(require("bcrypt"));
var cookieParser = require("cookie-parser");
function findUserById(req, res) {
  return __async(this, null, function* () {
    try {
      const id = req.params.id;
      const user = yield UserModel.findOne({ uuid: id });
      if (!user) {
        return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      return res.status(200).json(user);
    } catch (e) {
      logger_default.error(`Erro no sistema: ${e.message}`);
    }
  });
}
function login(req, res) {
  return __async(this, null, function* () {
    try {
      const { email, password } = req.body;
      const checkUser = yield UserModel.findOne({ email });
      if (checkUser) {
        if (checkUser.password) {
          const isPasswordValid = import_bcrypt.default.compareSync(
            password,
            // Senha digitada no POSTMAN (requisição)
            checkUser.password
            // Senha do model / Banco de dados
          );
          if (isPasswordValid) {
            const userId = checkUser.uuid;
            if (userId) {
              const token = tokenService_default.generateToken(userId);
              res.setHeader("Set-Cookie", [
                (0, import_cookie.serialize)("userId", userId, {
                  httpOnly: true,
                  maxAge: 100,
                  // Define a expiração do cookie (em segundos)
                  sameSite: "none",
                  // Define a política SameSite para cross-site cookies
                  secure: true
                  // Somente envia o cookie em conexões HTTPS
                }),
                (0, import_cookie.serialize)("JWT", token, {
                  httpOnly: true,
                  maxAge: 100,
                  // Define a expiração do cookie (em segundos)
                  sameSite: "none",
                  // Define a política SameSite para cross-site cookies
                  secure: true
                  // Somente envia o cookie em conexões HTTPS
                })
              ]);
              return res.status(201).json({ message: "Login bem-sucedido!", userId, token });
            }
          } else {
            return res.status(401).json({ message: "Senha inv\xE1lida!" });
          }
        } else {
          return res.status(404).json({ message: "Senha inv\xE1lida!" });
        }
      } else {
        return res.status(404).json({ message: "Email inv\xE1lido!" });
      }
    } catch (error) {
      logger_default.error("Erro no login:", error);
      return res.status(500).json({ message: "Erro no servidor." });
    }
  });
}
function setCookie(req, res) {
  return __async(this, null, function* () {
    try {
      res.cookie("cookieName", "cookieValue", {
        sameSite: "strict",
        // SameSite pode ser 'strict', 'lax', 'none', etc.
        secure: true,
        // Define como true para enviar apenas por conexões HTTPS
        httpOnly: false
        // Evita que o cookie seja acessado por scripts do lado do cliente
      });
      res.send("Cookie configurado com sucesso!");
    } catch (error) {
      logger_default.error("Erro no logout:", error);
      return res.status(500).json({ message: "Erro no servidor." });
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findUserById,
  login,
  setCookie
});
