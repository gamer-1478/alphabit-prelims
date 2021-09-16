const express = require('express')
const router = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require('../reusable/passport_reuse')
const Product = require('../models/product')
const { fetch_get } = require('../reusable/misc_reuse')
const admin = require("../firebase");
const db = admin.firestore();
const userCollection = db.collection("users");

/*router.get('/add_data', async (req, res) => {
    const response = await fetch_get('https://fakestoreapi.com/products/')
    await response.forEach(async element => {
        var prod = new Product({ title: element.title, description: element.description, price: element.price, category:element.category, image_: element.image, rating: { rate: element.rating.rate, count: element.rating.count } })
        await prod.save(function (err, prodcut) {
            if (err) return console.error(err);
            console.log(product.title + " saved to products collection.");
        });
    });
    res.send('hi')
})*/

router.get('/',(req,res)=>{
    Product.find().then((result) => {
        const products = result
        for (var j = 0; j < products.length; j++) {
        }
        res.render('pages/type/consumer', { "title": 'Consumer Dashboard', "user": req.user, "products": products })
    })

})

router.post('/', ((req, res) => {
const query = req.body.query;
Product.find({$or: [{title:{'$regex': query, "$options": "i"}}, {description: {'$regex': query, "$options":"i"}}]}).then((result)=> {
    const products = result;

    res.render('pages/type/consumer', {title: 'Consumer Dashboard', user:req.user, products:products})
})
}))

router.post('/add_to_cart', async (req, res) =>{
    var count = parseInt(req.body.count)
    const name = req.body.title
    Product.findOne({title:name}).then(async (result)=> {
        var title = result['title']
        var price = result['price']
        var image_ = result['image_']
        var product = {
            title: title,
            price: price,
            image_:image_,
            count:count
        }
        await userCollection.doc(req.user.username).update({
            cart: admin.firestore.FieldValue.arrayUnion(product)
        }).then((resp)=> {
            console.log('Added to cart')
            res.redirect('/dashboard')
        }).catch((err)=> {
            console.log(err)
        })
    })
    // await userCollection.doc(req.body.username).set({
    //
    // })

})


module.exports = router;