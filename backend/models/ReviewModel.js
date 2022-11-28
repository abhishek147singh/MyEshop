import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
        writerName: { type: String, required: true },
        rating:{type : Number , required : true },
        comment:{type : String },
        user : { type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true },
        product : { type : mongoose.Schema.Types.ObjectId , ref : 'Product' , required : true },    
    },
    {
        timestamps: true
    });

const Review = mongoose.model('Review', ReviewSchema);
export default Review;