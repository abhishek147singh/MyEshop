import express from "express";
import expressAsyncHandler from "express-async-handler";
import Review from "../models/ReviewModel.js";
import { isAuth } from "../utiles.js";

const reviewRouter = express.Router();

reviewRouter.get("/:id", expressAsyncHandler(async (req, res) => {
    const reviews = await Review.find({ product: req.params.id });
    if (reviews) {
        res.send(reviews);
    } else {
        res.send([]);
    }
}));


reviewRouter.post("/", isAuth , expressAsyncHandler(async (req, res) => {
    try{
       const review = new Review({
           writerName  : req.user.name,
           rating : req.body.rating,
           comment : req.body.comment,
           user : req.user._id ,
           product : req.body.product 
        });
       const newReview = await review.save();
       res.status(201).send(newReview);
    }catch(err){
       console.log(err);
    }
}));

export default reviewRouter;