"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/models/Image.ts
var Image_exports = {};
__export(Image_exports, {
  ImageModel: () => ImageModel
});
module.exports = __toCommonJS(Image_exports);
var import_mongoose = require("mongoose");
var productSchema = new import_mongoose.Schema(
  {
    id: { type: String },
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
var ImageModel = (0, import_mongoose.model)("Image", productSchema, "images");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ImageModel
});
