import express from "express";
import { addItemToCart, clearCart, deleteItemInCart, getActiveCart, updateItemInCart } from "../services/cartService.js";
import validateJWT from "../middlewares/validateJWT.js";
import type { ExtendedRequest } from "../middlewares/validateJWT.js";
import { getProductById } from "../services/productService.js";

const router = express.Router()

router.get("/", validateJWT, async (req: ExtendedRequest, res) => {
  const userId = req.user?._id;  
  const cart = await getActiveCart({ userId });
  res.status(200).send(cart);
});
router.delete("/", validateJWT, async (req: ExtendedRequest, res) => {
    const userId = req.user?._id;  
    const response = await clearCart({userId})
    res.status(response.statusCode).send(response.data)


})
router.post("/items", validateJWT, async (req: ExtendedRequest, res) => {
  const userId = req.user?._id;
  const { productId, quantity } = req.body;

  const response = await addItemToCart({ userId, productId, quantity });
    res.status(response.statusCode).send(response.data);

}
)
router.put("/items", validateJWT, async (req: ExtendedRequest, res) => {
  const userId = req.user?._id;
  const { productId, quantity } = req.body;

  const response = await updateItemInCart({ userId, productId, quantity });
  res.status(response.statusCode).send(response.data);

}
)
router.delete("/items/:productId", validateJWT, async (req: ExtendedRequest, res) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.params;

    // Make sure both values exist
    if (!userId || !productId) {
      return res.status(400).send("Missing userId or productId");
    }

    const response = await deleteItemInCart({ userId, productId });
    res.status(response.statusCode).send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
export default router;

