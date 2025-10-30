import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import { seedProducts } from "./services/productService.js";
import cartRoute from "./routes/cartRoute.js";

const app = express();
const port = 3001;

app.use(express.json())

mongoose
  .connect("mongodb://localhost:27017/ecommerce")
  .then(() => console.log("Mongo Connected!"));

app.use('/user',userRoute)
app.use('/products',productRoute)
app.use('/cart',cartRoute)


seedProducts();

app.listen(port, () => {
  console.log("Server is running");
});
