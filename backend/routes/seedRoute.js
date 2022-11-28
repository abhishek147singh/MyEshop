import express from "express";
import data from "../data.js";
import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";

const seedRouter = express.Router();

seedRouter.get("/" , async (req , res) => {
   await Product.deleteMany({});//remove all products
   const createdProducts = await Product.insertMany(data.Products);
   await User.deleteMany({});//remove all users
   const createdUsers = await User.insertMany(data.Users);
   res.send({ createdUsers , createdProducts });
});

export default seedRouter;