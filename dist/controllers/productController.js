"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
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

// config/logger.ts
var logger_exports = {};
__export(logger_exports, {
  default: () => logger_default
});
var import_winston, import_config, levels, level, colors, format, transports, Logger, logger_default;
var init_logger = __esm({
  "config/logger.ts"() {
    "use strict";
    import_winston = __toESM(require("winston"));
    import_config = __toESM(require("config"));
    levels = {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      debug: 4
    };
    level = () => {
      const env = import_config.default.get("env") || "development";
      const isDevelopment = env === "development";
      return isDevelopment ? "debug" : "warn";
    };
    colors = {
      error: "red",
      warn: "yellow",
      info: "green",
      http: "magenta",
      debug: "white"
    };
    import_winston.default.addColors(colors);
    format = import_winston.default.format.combine(
      import_winston.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      // Formato para tempo
      import_winston.default.format.colorize({ all: true }),
      // Ativar as cores
      import_winston.default.format.printf(
        (info) => `${info.timestamp} - ${info.level}: ${info.message}`
        // Formato da mensagem
      )
    );
    transports = [
      new import_winston.default.transports.Console(),
      new import_winston.default.transports.File({
        filename: "logs/error.log",
        level: "error"
      }),
      new import_winston.default.transports.File({ filename: "logs/all.log" })
    ];
    Logger = import_winston.default.createLogger({
      level: level(),
      levels,
      format,
      transports
    });
    logger_default = Logger;
  }
});

// src/controllers/productController.ts
var productController_exports = {};
__export(productController_exports, {
  createProduct: () => createProduct
});
module.exports = __toCommonJS(productController_exports);

// src/models/Product.ts
var import_mongoose = require("mongoose");
var productSchema = new import_mongoose.Schema(
  {
    id: { type: String },
    title: { type: String, required: false },
    description: { type: String, required: false },
    price: { type: String, required: false },
    category: { type: String, required: false },
    unity: { type: String, required: false },
    isPromotion: { type: Boolean },
    promoPrice: { type: Number },
    nameImage: { type: String },
    size: { type: Number },
    key: { type: String },
    url: { type: String },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);
productSchema.pre("save", function() {
  if (!this.url) {
    this.url = `https://lidermadeiras-api.onrender.com/files/${this.key}`;
  }
});
var ProductModel = (0, import_mongoose.model)("Product", productSchema, "products");

// src/controllers/productController.ts
init_logger();
var multer = require("multer");
var multerConfig = (init_logger(), __toCommonJS(logger_exports));
function createProduct(req, res) {
  return __async(this, null, function* () {
    try {
      const { originalname: nameImage, size, key, location: url = "" } = req.file;
      const product = yield ProductModel.create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        unity: req.body.unity,
        isPromotion: req.body.isPromotion ? req.body.isPromotion : false,
        promoPrice: req.body.isPromotion ? req.body.promoPrice : 0,
        nameImage,
        size,
        key,
        url
      });
      return res.status(201).json(product);
    } catch (e) {
      logger_default.error(`Erro no sistema: ${e.message}`);
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createProduct
});
