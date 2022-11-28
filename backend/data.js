import bcrypt from "bcryptjs";

export default { 
    Products:[
     {
        name:"The Nice shirt",
        imageSrc:"images/p1.jpg",
        noReviews:10,
        rating:4.2,
        brand:"Nike",
        category:"shirt",
        discreption:"This is a nice product ever. you must buy it.",
        price:250,
        countInStock:0
    },
    {
        name:"The per shirt",
        imageSrc:"images/p2.jpg",
        noReviews:8,
        brand:"Nike",
        category:"shirt",
        rating:4.5,
        discreption:"This is a nice product ever. you must buy it.",
        price:200,
        countInStock:8
    },
    {
        name:"Nice cotton shirt",
        imageSrc:"images/p3.jpg",
        noReviews:7,
        brand:"Nike",
        category:"shirt",
        rating:4.0,
        discreption:"This is a nice product ever. you must buy it.",
        price:300,
        countInStock:4
    },
    {
        name:"The good shirt",
        imageSrc:"images/p4.jpg",
        noReviews:8,
        brand:"addidas",
        category:"shirt",
        rating:4.6,
        discreption:"This is a nice product ever. you must buy it.",
        price:265,
        countInStock:6
    },
    {
        name:"Sallow shirt",
        imageSrc:"images/p5.jpg",
        noReviews:9,
        brand:"addidas",
        category:"shirt",
        rating:3.8,
        discreption:"This is a nice product ever. you must buy it.",
        price:100,
        countInStock:5
    }
],
Users:[
    {name : 'Abhishek' , email: 'abhi@example.com' , password : bcrypt.hashSync('123456') , isAdmin:true },
    {name : 'shidu' , email: 'shidu@example.com' , password : bcrypt.hashSync('123456') , isAdmin:false },
]
}