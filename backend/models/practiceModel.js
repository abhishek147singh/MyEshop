import mongoose from "mongoose";


const imageSchema = new mongoose.Schema({
    name: { type: String, required: true},
    image : {
        data : Buffer,
        contentType : String
    }
} , 
{
    timestamps : true
});

const imageModel = mongoose.model('imageModel' , imageSchema );
export default imageModel;
