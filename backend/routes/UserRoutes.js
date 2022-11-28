import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import { generateToken, isAuth } from "../utiles.js";


const userRouter = express.Router();

userRouter.post("/signin", expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user)
            });

            return;
        } else {
            res.status(401).send({ message: 'Invalid email or password' });
        }
    } else {
        res.status(401).send({ message: 'Invalid email or password' });
    }
}))

userRouter.post("/signup", expressAsyncHandler(async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
    });

    const user = await newUser.save();
    res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user)
    });

}));


userRouter.get("/:id", isAuth , expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        res.send(user);
    } else {
        res.status(404).send({ message: "User Not Found" });
    }
}));

userRouter.put("/profile", isAuth, expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password);
        }

        const updatedUser = await user.save();
        res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser),
        })
    }else{
        res.status(404).send({message : "Not Found"});
    }
}));

userRouter.put("/admin/update/:id", isAuth, expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin === "true") {
        try{ 
            const user = await User.findById(req.body.id);
            if (user) {
                user.name = req.body.name || user.name;
                user.isAdmin = req.body.isAdmin || user.isAdmin;
        
                const updatedUser = await user.save();
                res.send({
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    isAdmin: updatedUser.isAdmin,
                });
            }else{
                res.status(404).send({message : "Not Found"});
            }
        }catch(err){
            res.status(401).send({message : err });
            console.log(err);
        }
       
    }else{
        res.status(404).send({message : "Not Found"});
    }
}));



userRouter.get("/admin/users", isAuth, expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin === "true") {
        try {
            const users = await User.find({});
            res.send(users);
        } catch (err) {
            res.status(404).send({ message: 'Not Found' });
        }
    } else {
        res.status(404).send({ message: 'Not Found' });
    }
}));

userRouter.delete("/admin/delete/:id", isAuth, expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin === "true") {
        try {
            await User.deleteOne({ _id: req.params.id });
            res.send({ message: "User is deleted successfully." });
        } catch (err) {
            res.status(404).send({ message: err.message });
        }
    } else {
        res.status(404).send({ message: 'Not Found' });
    }
}));


export default userRouter;