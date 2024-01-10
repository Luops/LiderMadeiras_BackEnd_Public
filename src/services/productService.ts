import { Request, Response } from "express";

// Model
import { ProductModel } from "../models/Product";
import { ImageModel } from "../models/Image";

// Logger
import Logger from "../../config/logger";

// Multer
const multer = require("multer");
const multerConfig = require("../../config/multer");

// AWS
const aws = require("aws-sdk");
const s3 = new aws.S3();
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
  region: process.env.AWS_DEFAULT_REGION, // Substitua pela sua região
});

// Node
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

export async function findProducts(req: Request, res: Response) {
  try {
    const products = await ProductModel.find();

    if (!products) {
      return res.status(404).json({ message: "Não há produtos cadastrados!" });
    }

    return res.status(200).json(products);
  } catch (e: any) {
    Logger.error(`Erro no sistema: ${e.message}`);
  }
}

export async function deleteProductById(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    const product = await ProductModel.findOne({ _id: id });

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado!" });
    }
    /*
    // Execute o código de exclusão antes de chamar deleteOne, caso seja no S3
    if (STORAGE_TYPE === process.env.STORAGE_TYPE) {
      await s3
        .deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: product.key, // Use a chave do produto
        })
        .promise();
    } else {
      await promisify(fs.unlink)(
        path.resolve(__dirname, "..", "..", "tmp", "uploads", product.key)
      );
    }*/
    await product.deleteOne();
    return res.status(204).send(); // 204 No Content, indicando que o produto foi removido com sucesso.
  } catch (e: any) {
    Logger.error(`Erro no sistema ${e.message}`);
  }
}

export async function deleteImageByProduct(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    const product = await ProductModel.findOne({ _id: id });

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado!" });
    }

    // Execute o código de exclusão antes de chamar deleteOne, caso seja no S3
    if (process.env.STORAGE_TYPE === "s3") {
      await s3
        .deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: product.key, // Use a chave do produto
        })
        .promise();
    } else {
      await promisify(fs.unlink)(
        path.resolve(__dirname, "..", "..", "tmp", "uploads", product.key)
      );
    }

    // Deletar somente a url do banco
    product.url = " ";
    // Preciso com que não fique o local host no banco

    await product.save();

    return res.status(204).send(); // 204 No Content, indicando que o produto foi removido com sucesso.
  } catch (e: any) {
    Logger.error(`Erro no sistema ${e.message}`);
  }
}

export async function findProductById(req: Request, res: Response) {
  try {
    // Coletar a id pelo parametro passado pela url (/api/product/xxxxxxxxxx)
    const id: string = req.params.id;

    // Buscar os dados do usuário no banco de dados
    const product = await ProductModel.findOne({ _id: id });

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado!" });
    }

    return res.status(200).json(product);
  } catch (e: any) {
    Logger.error(`Erro no sistema: ${e.message}`);
  }
}

export async function findProductsByCategory(req: Request, res: Response) {
  try {
    const { category } = req.params;
    const { isPromotion } = req.query;

    if (!category) {
      return res.status(404).json({ message: "Categória não informada!" });
    }

    let selectedCategories = Array.isArray(category) ? category : [category];
    let products = await ProductModel.find();

    if (isPromotion !== undefined) {
      if (isPromotion === "true" && category === "all") {
        products = products.filter((product) => product.isPromotion);
      } else if (isPromotion === "true" && category !== "all") {
        // Se category não for "all", filtre somente pela categoria selecionada, ignorando a promoção
        products = products.filter(
          (product) => product.isPromotion && product.category === category
        );
      } else if (isPromotion === "false") {
        if (category !== "all") {
          // Se category não for "all", filtre somente pela categoria selecionada, ignorando a promoção
          products = products.filter(
            (product) => product.category === category && products
          );
        } else {
          products;
        }
      }
      // Envie a resposta adequada para o filtro de promoção aplicado ou para a categoria selecionada
      return res.status(200).json(products);
    }

    // Filtro de produtos basado nas categorias selecionadas
    products = products.filter((product) =>
      selectedCategories.includes(product.category)
    );

    return res.json(products);
  } catch (e: any) {
    Logger.error(`Erro no sistema: ${e.message}`);
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    // Verifique se o produto existe no banco de dados
    const product = await ProductModel.findOne({ _id: id });

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado!" });
    }

    // Obtenha os novos valores do corpo da solicitação
    const {
      title,
      description,
      price,
      category,
      unity,
      isPromotion,
      promoPrice,
      url,
    } = req.body;
    // Atualize os campos do produto existente com os novos valores

    product.title = title;
    product.description = description;
    product.price = price;
    product.category = category;
    product.unity = unity;
    product.isPromotion = isPromotion;
    product.promoPrice = promoPrice;
    product.url = url;

    // Salve as alterações no banco de dados
    await product.save();

    return res.status(200).json(product);
  } catch (e: any) {
    Logger.error(`Erro no sistema: ${e.message}`);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}

export async function uploadImage(req: Request, res: Response) {
  try {
    /**
     * renomear os arquivos que foram enviados
     */
    const { originalname: nameImage, size, key, location: url = "" } = req.file;

    /**
     * Coletar dados do que foi escrito e dos arquivos e enviar para o mongoDB
     */
    const image = await ImageModel.create({
      nameImage,
      size,
      key,
      url,
    }); // Aguardando um input do model, e criar o usuário com os dados da requisição

    return res.status(201).json(image);
  } catch (e: any) {}
}
