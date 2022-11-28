import express, { query } from "express";
import Product from "../models/ProductModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAuth } from "../utiles.js";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './../world/public/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
    const Products = await Product.find({});
    res.send(Products);
});

productRouter.get("/categories", expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
}));

const PAGE_SIZE = 3;

productRouter.get("/search", expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const brand = query.brand || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter = searchQuery && searchQuery !== 'all' ? { name: { $regex: searchQuery, $options: 'i' } } : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter = rating && rating !== 'all' ? { rating: { $gte: Number(rating) } } : {};
    const priceFilter = price && price !== 'all' ? { price: { $gte: Number((price.split('-'))[0]), $lte: Number((price.split('-'))[1]) } } : {};

    const sortOrder = order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
            ? { price: 1 }
            : order === 'highest'
                ? { price: -1 }
                : order === 'newest'
                    ? { createdAt: -1 }
                    : { _id: -1 };

    const products = await Product.find({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter
    }).sort(sortOrder).skip(pageSize * (page - 1)).limit(pageSize);

    const countProducts = await Product.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter
    });
    res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize)
    });
}));

productRouter.get("/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: "Product not found." });
    }
});

productRouter.get("/admin/products", isAuth, expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin === "true") {
        try {
            const products = await Product.find({});
            res.send(products);
        } catch (err) {
            res.status(404).send({ message: 'Product Not Found' });
        }
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
}));


productRouter.post("/admin/create", isAuth, upload.single("image") , expressAsyncHandler(async (req, res) => {
    
    if (req.user.isAdmin === "true") {
        try {
            const newProduct = new Product({
                name: req.body.name,
                price: req.body.price,
                imageSrc: 'images/' + req.file.originalname,
                category: req.body.category,
                brand: req.body.brand,
                discreption: req.body.discription,
                countInStock: req.body.countInStock,
                noReviews: 0,
                rating: 0
            });

            const product = await newProduct.save();
            res.send(product);

        } catch (err) {
            console.log(err);
            res.status(404).send({ message: err.message });
        }
    } else {
        console.log("Not Admin !");
        res.status(404).send({ message: 'Product Not Found' });
    }
}));


productRouter.put("/admin/update/:id", isAuth, expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin === "true") {

        try {
            const product = await Product.findById(req.params.id);
            if (product) {
                product.name = req.body.name;
                product.price = req.body.price;
                product.imageSrc = req.body.imageSrc;
                product.category = req.body.category;
                product.brand = req.body.brand;
                product.discreption = req.body.discription;
                product.countInStock = req.body.countInStock;

                const updatedProduct = await product.save();

                res.send(updatedProduct);
            } else {

                res.status(404).send({ message: "Product not found." });
            }
        } catch (err) {

            res.status(404).send({ message: err.message });
        }
    } else {

        res.status(404).send({ message: 'Product Not Found' });
    }
}));

productRouter.delete("/admin/delete/:id", isAuth, expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin === "true") {
        try {
            const product = await Product.deleteOne({ _id: req.params.id });
            res.send({ message: "Product is deleted successfully." });
        } catch (err) {
            res.status(404).send({ message: err.message });
        }
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
}));

export default productRouter;