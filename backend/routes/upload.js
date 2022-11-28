const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req , res , cb){
        cb(null , 'uploads/');
    },
    filename:function(req , file ,cb){
        let ext = path.extname(file.originalname);
        cb(null , Date.now() + ext);
    }
});

const uploads = multer({
    storage:storage,
    fileFilter:function(req , file , cb){
        if(file.mimetype == "image/png" || file.mimetype == "image/jpg"){
            cb(null , true);
        }else{
            console.log("only jpg & png file supported !");
            cb(null , false);
        }
    },
    limits:{
        fileSize: 1024 * 1024 * 2
    }
});

module.exports = uploads;