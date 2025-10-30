import { cartModel } from "../models/cartModel.js";
import type { cartDTO } from "./DTOs/cartDTO.ts";
import type { addItemToCartDTO } from "./DTOs/addItemToCartDTO.ts";
import { productModel } from "../models/productModel.js";

const createCart = async ({ userId }:cartDTO) =>{
    const cart = await cartModel.create({userId})
    await cart.save();
    return cart;
}

export const getActiveCart = async ({ userId }:cartDTO) =>{
    let cart = cartModel.findOne({userId,status:"active"})
    if(!cart){
        const cart = await createCart({userId})
    }
    return cart;
}
export const clearCart = async ({ userId }: cartDTO) => {
  const cart = await getActiveCart({ userId });

  if (!cart) {
    return { data: "Active cart not found", statusCode: 404 };
  }

  // ✅ Safe assignment
  cart.items = [];
  await cart.save();

  return { data: "Cart cleared successfully", statusCode: 200 };
};
export const addItemToCart = async ({ productId,quantity,userId }:addItemToCartDTO) =>
    {
        const cart = await getActiveCart({userId})
        const existsInCart = cart?.items.find((p) => p.product === productId);
        if(existsInCart){
            return{data:"Product already exists in cart",statusCode:400}
        }
        const product = await productModel.findById(productId);
        if(!product){
             return{data:"Product not found",statusCode:400}


        }
        cart?.items.push({product:productId,unitPrice:product.price,quantity: parseInt(quantity)})
        const updatedCart = await cart?.save();

        return { data: updatedCart, statusCode:200}
    };
    export const updateItemInCart = async ({
  userId,
  productId,
  quantity,
}: addItemToCartDTO) => {
  const cart = await getActiveCart({ userId });

  if (!cart) {
    return { data: "Active cart not found", statusCode: 404 };
  }

  const item = cart.items.find(
    (p: any) => p.product.toString() === productId
  );

  if (!item) {
    return { data: "Product not found in cart", statusCode: 404 };
  }

  // Update quantity
item.quantity = parseInt(quantity);
  await cart.save();

  return { data: "Cart item updated successfully", statusCode: 200 };

};
export const deleteItemInCart = async ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  // 1️⃣ Find the active cart for this user
  const cart = await getActiveCart({ userId });

  if (!cart) {
    return { data: "Active cart not found", statusCode: 404 };
  }

  // 2️⃣ Check if the product exists in the cart
  const itemIndex = cart.items.findIndex(
    (p: any) => p.product.toString() === productId
  );

  if (itemIndex === -1) {
    return { data: "Product not found in cart", statusCode: 404 };
  }

  // 3️⃣ Remove it from the array
  cart.items.splice(itemIndex, 1);

  // 4️⃣ Save the updated cart
  const updatedCart = await cart.save();

  return { data: updatedCart, statusCode: 200 };
};