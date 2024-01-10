// Logger
import Logger from "./logger";

const multer = require("multer");
const path = require("path");
const crypt = require("crypto");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const aws = require("aws-sdk");

const awsKey = "AKIAZXQBKBVEP24NDOU7";
const awsKeySecret = "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";
const awsRegion = "sa-east-1";

const s3 = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsKey,
    secretAccessKey: awsKeySecret,
  },
});

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "tmp", "uploads"));
    },
    filename: (req, file, cb) => {
      crypt.randomBytes(16, (err, hash) => {
        if (err) return cb(err);

        file.key = `${hash.toString("hex")}-${file.originalname}`;

        cb(null, file.key);
      });
    },
  }),
  s3: multerS3({
    s3: s3,
    bucket: "uploadimageslider",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      Logger.info("S3");
      crypt.randomBytes(16, (err, hash) => {
        if (err) return cb(err);

        const fileName = `${hash.toString("hex")}-${file.originalname}`;

        cb(null, fileName);
      });
    },
  }),
};

module.exports = {
  dest: path.resolve(__dirname, "..", "tmp", "uploads"), // Enviar para onde?
  storage: storageTypes["s3"],
  limits: {
    fileSize: 2 * 32 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  },
};
