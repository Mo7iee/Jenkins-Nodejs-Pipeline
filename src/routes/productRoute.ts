import express, { request, response } from "express";
import {deleteProduct, getAllProducts, getProductById, updateProduct} from "../services/productService.js"
const router = express.Router()

router.get('/', async (request,response) =>{
    const products= await getAllProducts();
    response.status(200).send(products)
})
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const product = await getProductById(id);

    if (!product) {
      return response.status(404).json({ message: "Product not found" });
    }

    response.status(200).json(product);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Server error" });
  }
});
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const deletedProduct = await deleteProduct(id);

    if (!deletedProduct) {
      return response.status(404).json({ message: "Product not found" });
    }

    response.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Server error" });
  }
});
router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const updatedData = request.body;

    const updatedProduct = await updateProduct(id, updatedData);

    if (!updatedProduct) {
      return response.status(404).json({ message: "Product not found" });
    }

    response.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Server error" });
  }
});
export default router;


