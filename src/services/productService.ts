import { productModel } from "../models/productModel.js";

export const getAllProducts = async () => {
  return await productModel.find();
};

export const getProductById = async (_id: any) => {
  return await productModel.findById(_id);
};
export const deleteProduct = async (_id: any) => {
  return await productModel.findByIdAndDelete(_id);
};
export const updateProduct = async (_id:any, updatedData: any) => {
  return await productModel.findByIdAndUpdate(_id, updatedData, {
    new: true,         
    runValidators: true 
  });
};
export const seedProducts = async () => {
  const products = [
    { title: "Product 1", image: "img1.jpg", price: 10, stock: 100 },
    { title: "Product 2", image: "img2.jpg", price: 20, stock: 50 },
];

    const existingproducts = await getAllProducts();
    if(existingproducts.length===0){
        await productModel.insertMany(products)
    }
}

