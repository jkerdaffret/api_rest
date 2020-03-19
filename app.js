const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const methodeOverride = require("method-override")

const app = express();

// Method-override
app.use(methodeOverride("_method"));

// Handlebars
app.engine('hbs', exphbs({defaultLayout: 'main', extname: 'hbs'}));
app.set('view engine', 'hbs')

// BodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));

// MongoDB
mongoose.connect("mongodb://localhost:27017/boutiqueGame", {useNewUrlParser: true})

const productSchema = {
    title: String,
    content: String,
    price: Number
};

const Product = mongoose.model("product", productSchema)

// Routes
app.route("/")
.get((req, res) => {
   Product.find(function(err, produit){
    console.log(produit)
       if(!err) {
           res.render("index", {
               product : produit 
           })
           
       } else {
           res.send(err)
       }
   })
})

.post((req, res) => {
    const newProduct = new Product({
        title: req.body.title,
        content: req.body.content,
        price: req.body.price
    });
    newProduct.save(function(err){
        if(!err){
            res.send("save ok !")
        } else {
            res.send(err)
        }
    })
})
.delete(function(req, res) {
    Product.deleteMany(function(err){
        if(!err){
            res.send("All delete")
        } else {
            res.send(err)
        }
    })
})

// Route édition
app.route("/:id")
.get(function(req, res) {
    Product.findOne(
        {_id : req.params.id},
        function(err, produit) {
            if(!err) {
                res.render("edition", {
                    _id: produit.id,
                    title: produit.title,
                    content: produit.content,
                    price: produit.price
                })
            } else {
                res.send(err)
            }
        }
    )
})

.put(function(req, res){
    Product.update(
        // condition
        {_id: req.params.id},
        // update
        {
            title: req.body.title,
            content: req.body.content,
            price: req.body.price
        },
        // option
        {multi:true},
        // exec
        function(err){
            if(!err){
                res.send("Update OK !")
            } else {
                res.send(err)
            }
        }
    )
})
.delete(function(req, res){
    Product.deleteOne(
        {_id: req.params.id},
        function(err) {
            if(!err){
                res.send("product delete")
            } else {
                res.send(err)
            }
        }
    )
})



app.listen(4000, function(){
    console.log("Écoute le port 4000");
})