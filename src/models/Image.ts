import { model, Schema } from "mongoose";

// Dados que compoem o produto
const productSchema = new Schema(
  {
    id: { type: String },
    nameImage: { type: String },
    size: { type: Number },
    key: { type: String },
    url: { type: String },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function () {
  if (!this.url) {
    this.url = `https://lidermadeiras-api.onrender.com/files/${this.key}`; //
  }
});

export const ImageModel = model("Image", productSchema, "images");
