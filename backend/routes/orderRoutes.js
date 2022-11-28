import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/OrderModel.js";
import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import { isAuth } from "../utiles.js";


const orderRouter = express.Router();

orderRouter.post("/" , isAuth , expressAsyncHandler( async (req , res) => {
   const newOrder = new Order({
        orderItems : req.body.orderItems.map((x) => ({ ...x , image:x.imageSrc , product:x._id})),
        shippingAddress:req.body.shippingAddress,
        paymentMethod:req.body.paymentMethod,
        itemsPrice:req.body.itemsPrice,
        shippingPrice:req.body.shippingPrice,
        taxPrice:req.body.taxPrice,
        totalPrice:req.body.totalPrice,
        user:req.user._id
   });
   
     const order = await newOrder.save();

     res.status(201).send({message : 'New Order Created' , order });
}))


orderRouter.get("/mine", isAuth  ,expressAsyncHandler( async (req , res) => {
     const orders = await Order.find({ user : req.user._id });
     res.send(orders);
 }));

orderRouter.get("/admin/orders", isAuth , expressAsyncHandler( async (req , res) => {
     if(req.user.isAdmin === "true"){
          try{
               const orders = await Order.find({});
               res.send(orders);
          }catch(err){
               res.status(404).send({message : err.message });
          }
     }else{
          res.status(404).send({message : 'Not Found'});
     }
 }));

 orderRouter.get("/admin/orders/graphData", isAuth , expressAsyncHandler( async (req , res) => {
     if(req.user.isAdmin === "true"){
          try{
               const data = await Order.aggregate([ 
                    {   $group : { 
                               _id:{ $dateToString: { format : "%Y-%m-%d" , date : "$createdAt" }  },         
                               totalAmt: { $sum : "$totalPrice" },         count : { $sum : 1}   
                         } 
                    },
                    {
                         $sort : { _id: 1 }
                    } 
               ]);
               
               const users = await User.find({}).count();
               const products = await Product.find({}).count();

               res.send({ graphData : data  , users , products });
          }catch(err){
               res.status(404).send({message : err.message });
          }
     }else{
          res.status(404).send({message : 'Not Found'});
     }
 }));

 orderRouter.get("/admin/order/:id", isAuth , expressAsyncHandler( async (req , res) => {
     if(req.user.isAdmin === "true"){
          try{
               const order = await Order.findById(req.params.id);
               if(order){
                    res.send(order);
               } else{
                    res.status(404).send({message : 'Order Not Found'});
               }
          }catch(err) {
               res.status(404).send({message : 'Order Not Found'});
          }
     }else{
          res.status(404).send({message : 'Not Found'});
     }
 }));

 orderRouter.put("/admin/order/:id", isAuth , expressAsyncHandler( async (req , res) => {
     if(req.user.isAdmin === "true"){
          try{
               const order = await Order.findById(req.params.id);
               order.isDelivered = true;
               order.deliveredAt = Date.now();
               const updateOrder = await order.save();
               res.send({message : 'Order Deliver' , order : updateOrder });
          }catch(err) {
               res.status(404).send({message : 'Order Not Found'});
          }
     }else{
          res.status(404).send({message : 'Not Found'});
     }
 }));



orderRouter.get("/:id" , isAuth , expressAsyncHandler( async (req , res) => {
     
     try{
          const order = await Order.findById(req.params.id);
          if(order){
               res.send(order);
          } else{
               res.status(404).send({message : 'Order Not Found'});
          }
     }catch(err) {
          res.status(404).send({message : 'Order Not Found'});
     }
  }));

  orderRouter.put("/:id/pay" , isAuth , expressAsyncHandler( async (req , res) => {
      const order = await Order.findById(req.params.id);
      if(order){
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
               id : req.body.id ,
               status : req.body.id ,
               update_time : req.body.update_time,
               email_address : req.body.email_address
          }

          const updateOrder = await order.save();
          res.send({message : 'Order Paid' , order : updateOrder });
      }else{
          res.status(404).send({message : 'Order Not Found' });
      }
  }));


export default orderRouter;