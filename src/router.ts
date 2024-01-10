import { Router, Request, Response } from "express";

// Multer
const multer = require("multer");
const multerConfig = require("../config/multer");

// Controller
import { createUser } from "./controllers/userController";
import { createProduct } from "./controllers/productController";
import { uploadImage } from "./controllers/imageController";

// Services
import { findUserById, login, setCookie } from "./services/userServices";
import {
  findProducts,
  findProductById,
  findProductsByCategory,
  deleteProductById,
  updateProduct,
  deleteImageByProduct,
} from "./services/productService";

const router = Router();

export default router
  .get("/test", (req: Request, res: Response) => {
    res.status(200).send("API Working!!!"); // Resposta no POSTMAN quando der certo (200), ou seja, entrar na rota de test
  })
  // Rota para usuários
  .post("/user", createUser) // Criar usuário de acordo com a função do createUser do controller.
  .post("/login", login) // Login do usuário.
  .get("/user/:id", findUserById) // Mostrar informações usuário.
  .get("/setCookie", setCookie)

  /**
   * Rotas para os produtos
   */
  .post("/product", multer(multerConfig).single("file"), createProduct) // Criar um produto
  .post("/image", multer(multerConfig).single("file"), uploadImage)
  .get("/product", findProducts) // Listar todos os produtos
  .get("/product/:id", findProductById) // Listar produto por ID
  .get("/product/category/:category", findProductsByCategory)
  .delete("/product/:id", deleteProductById) // Deletar produto.
  .delete("/image/:id", deleteImageByProduct) // Deletar imagem.
  .put("/product/:id", updateProduct); // Atualizar produto.
