const express = require('express')
const router = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require('../reusable/passport_reuse')
const Product = require('../models/product')
const { fetch_get } = require('../reusable/misc_reuse')
const admin = require("../firebase");
const { route } = require('./retailerRoute');
const e = require('express');
const { exists } = require('../models/product');
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

router.get('/', checkAuthenticated, (req, res) => {
    Product.find().then((result) => {
        const products = result
        for (var j = 0; j < products.length; j++) {
        }
        res.render('pages/type/consumer', { "title": 'Consumer Dashboard', "user": req.user, "products": products })
    })

})

router.post('/', checkAuthenticated, ((req, res) => {
    const query = req.body.query;
    Product.find({ $or: [{ title: { '$regex': query, "$options": "i" } }, { description: { '$regex': query, "$options": "i" } }] }).then((result) => {
        const products = result;

        res.render('pages/type/consumer', { title: 'Consumer Dashboard', user: req.user, products: products })
    })
}))

router.get('/product/:backlink', checkAuthenticated, async (req, res) => {
    var backlink = req.params.backlink
    Product.findById(backlink).then((result) => {
        res.render('pages/product', { title: result.title, product: result })
    }).catch((error) => { if (error) console.log(error) })
})

router.post('/add_to_cart', checkAuthenticated, async (req, res) => {
    var count = parseInt(req.body.count)
    const id = req.body.id
    Product.findById(id).then(async (result) => {
        if (count > 0 && result.quan > count) {
            await userCollection.doc(req.user.username).get().then(async (result_fire) => {
                result_fire = result_fire.data()

                if (result_fire.cart.length > 0) {
                    for (var i = 0; i < result_fire.cart.length; ++i) {
                        var result_fir = result_fire.cart[i]
                        if (await result_fir._id == id) {
                            console.log("found product, adding to count")
                            result.count = count
                            result_fire.cart[i] = result
                            await userCollection.doc(req.user.username).set(JSON.parse(JSON.stringify(result_fire))).then((resp) => {
                                console.log('Added to cart')
                                res.redirect('/consumer/cart')
                            }).catch((err) => {
                                console.log(err)
                            })
                            break
                        }
                        else if (i == result_fire.cart.length - 1) {
                            result.count = count
                            await userCollection.doc(req.user.username).update({
                                cart: admin.firestore.FieldValue.arrayUnion(JSON.parse(JSON.stringify(result)))
                            }).then((resp) => {
                                console.log('Added to cart')
                                res.redirect('/consumer/cart')
                            }).catch((err) => {
                                console.log(err)
                            })
                        }
                        else {
                            continue
                        }
                    }
                }
                else {
                    result.count = count
                    await userCollection.doc(req.user.username).update({
                        cart: admin.firestore.FieldValue.arrayUnion(JSON.parse(JSON.stringify(result)))
                    }).then((resp) => {
                        console.log('Added to cart')
                        res.redirect('/consumer/cart')
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            });
        }
        else{
            res.send({'message':"Please Make Sure Ur selected Quantity is 1 Or Greater And The Product is in Stock"})
        }
    })
})

router.post('/update_quan_cart', checkAuthenticated, async (req, res) => {
    var count = parseInt(req.body.count)
    const id = req.body.id
    Product.findById(id).then(async (result) => {
        await userCollection.doc(req.user.username).get().then(async (result_fire) => {
            result_fire = result_fire.data()

            if (result_fire.cart.length > 0) {
                for (var i = 0; i < result_fire.cart.length; ++i) {
                    var result_fir = result_fire.cart[i]
                    if (await result_fir._id == id) {
                        console.log("found product, removing quantity from cart to count")
                        result.count = count
                        if (result.count > 0) {
                            result_fire.cart[i] = result
                            await userCollection.doc(req.user.username).set(JSON.parse(JSON.stringify(result_fire))).then((resp) => {
                                console.log('Added to cart')
                                res.redirect('/consumer/cart')
                            }).catch((err) => {
                                console.log(err)
                            })
                        }
                        else {
                            result_fire.cart.splice(i, 1);
                            await userCollection.doc(req.user.username).set(JSON.parse(JSON.stringify(result_fire))).then((resp) => {
                                console.log('Added to cart')
                                res.redirect('/consumer/cart')
                            }).catch((err) => {
                                console.log(err)
                            })

                        }
                        break
                    }
                    else if (i == result_fire.cart.length - 1) {
                        res.send({ message: "Product doesn't exist in the server, thats WEIRD", success: false })
                    }
                    else {
                        continue
                    }
                }
            }
            else {
                res.send({ message: "Product doesn't exist in the server, thats WEIRD", success: false })
            }
        });
    })

})

router.get('/cart', checkAuthenticated, async (req, res) => {
    res.render('pages/cart.ejs', { title: "Cart", user: req.user })
})
module.exports = router;