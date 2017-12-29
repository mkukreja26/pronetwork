var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view-engine","ejs");
mongoose.connect("mongodb://localhost/commerce_app");



var productSchema = new mongoose.Schema({
    name: "String",
    image: "String",
    body: "String",
    created: {type: Date, default:  Date.now},
});

var Product = mongoose.model("Product", productSchema);


//INDEX ROUTE 
app.get("/",function(req,res){
    res.redirect("/products")
});

app.get("/products",function(req,res){
    Product.find({}, function(err, allproducts){
        if(err) {
            console.log(err);
        }
        else {
            res.render("index.ejs",{allproducts,allproducts})
        }
    });
});

//CREATE NEW GET
app.get("/products/new",function(req,res){
        res.render("new.ejs");
});


//CREATE NEW POST'
req.body.product.body = req.sanitize(req.body.product.body);
app.post("/products", function(req, res) {
    Product.create(req.body.product,function(err,newproduct){
        if(err) {
            console.log(err);
        }
        else {
            res.redirect("/products");
        }
    });
   
});


//SHOW ROUTE
app.get("/products/:id",function(req, res){

    Product.findById(req.params.id,function(err, productinfo){
    if(err) {
        res.redirect("/products");
    }
    else {
        res.render("show.ejs",{productinfo,productinfo})
    }
    });
    // res.send("This is show page");
});


//UPDATE GET ROUTE
app.get("/products/:id/edit",function(req,res){
    
    Product.findById(req.params.id,function(err,editproduct){
        if(err){
            res.redirect("/products")
        }
        else {
            res.render("edit.ejs",{editproduct,editproduct})
        }
    });
});


//UPDATE POST ROUTE
app.put("/products/:id", function(req,res){
    req.body.product.body = req.sanitize(req.body.product.body);
    Product.findByIdAndUpdate(req.params.id,req.body.product,function(err,updatedpproduct){
        if(err) {
            res.render("/products");
        }
        else {
            res.redirect("/products/" + req.params.id);
        }
    });
});
  

//DELETE ROUTE
app.delete("/products/:id",function(req,res){
    Product.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/products");
        }
        else {
            res.redirect("/products")
        }
    });
});


var listener = app.listen(8888,function(){
    console.log('Listening on port ' + listener.address().port);
});