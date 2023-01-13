import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import seedRouter from "./routes/seedRoute.js";
import productRouter from "./routes/ProductRoutes.js";
import userRouter from "./routes/UserRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import reviewRouter from "./routes/ReviewRoute.js";

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGOODB_URL).then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.log("Error :", err.message);
});

app.use(express.json());
app.use(express.urlencoded({extended : true }));
app.use('/api/seed/' , seedRouter );
app.use('/api/products' , productRouter);
app.use('/api/users' , userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/reviews', reviewRouter);

app.use((err , req , res , next) => {
    res.status(500).send({message : err.message }); 
})

app.get("/api/keys/paypal" , (req , res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
})

if(process.env.NODE_ENV  == "production"){
    app.use(express.static("world/build"));
}

app.listen(process.env.PORT || 5000 , () => {
    console.log("server is running");
})
