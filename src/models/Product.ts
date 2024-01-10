import { model, Schema } from "mongoose";

const URL = process.env.APP_URL

// Dados que compoem o produto
const productSchema = new Schema(
  {
    id: { type: String },
    title: { type: String, required: false },
    description: { type: String, required: false },
    price: { type: String, required: false },
    category: { type: String, required: false},
    unity: { type: String, required: false},
    isPromotion: { type: Boolean},
    promoPrice: { type: Number },
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
    this.url = `${URL}/files/${this.key}`; //
  }
});

export const ProductModel = model("Product", productSchema, "products");
