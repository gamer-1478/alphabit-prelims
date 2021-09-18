const express = require('express')
const router = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require('../reusable/passport_reuse')
const Product = require('../models/product')
const { fetch_get } = require('../reusable/misc_reuse')
const admin = require("../firebase");
const { compareSync } = require('bcrypt');
const { where } = require('../models/product');
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

router.get('/', checkAuthenticated, async (req, res) => {
    await Product.find().then((result) => {
        var testArray = [];
        const products = result;
        var j = 0, len = products.length;
        while (j < len) {
            j += 4
            testArray.push(products.splice(0, 4))
            if (j >= len - 1) {
                res.render('pages/type/consumer', { "title": 'Consumer Dashboard', "user": req.user, "products": testArray })
            }
        }
    })

})

router.post('/', checkAuthenticated, ((req, res) => {
    const query = req.body.query;
    Product.find({ $or: [{ title: { '$regex': query, "$options": "i" } }, { description: { '$regex': query, "$options": "i" } }] }).then((result) => {
        const products = result;
        var testArray = [];
        if (products.length > 0) {
            var j = 0, len = products.length;
            while (j < len) {
                j += 4
                testArray.push(products.splice(0, 4))
                if (j >= len - 1) {
                    res.render('pages/type/consumer', { "title": 'Consumer Dashboard', "user": req.user, "products": testArray })
                }
            }
        } else {
            res.render('pages/type/consumer', { "title": 'Consumer Dashboard', "user": req.user, "products": testArray })
        }
    })
}))

router.get('/product/:backlink', checkAuthenticated, async (req, res) => {
    var backlink = req.params.backlink
    Product.findById(backlink).then((result) => {
        res.render('pages/product', { title: result.title, product: result, user: req.user })
    }).catch((error) => { if (error) console.log(error) })
})

router.post('/add_to_cart', checkAuthenticated, async (req, res) => {
    var count = parseInt(req.body.count)
    const id = req.body.id
    Product.findById(id).then(async (result) => {
        if (count > 0 && result.quan >= count) {
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
        else {
            res.send({ 'message': "Please Make Sure Ur selected Quantity is 1 Or Greater And The Product is in Stock" })
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
    var testArray = [];
    const products = req.user.cart;
    var j = 0, len = products.length;
    if (products.length > 0) {
        while (j < len) {
            j += 2
            testArray.push(products.splice(0, 2))
            console.log(j, len)
            if (j >= len) {
                console.log(testArray)
                res.render('pages/cart.ejs', { title: "Cart", user: req.user, "cart": testArray })
            }
        }
    }
    else {
        res.render('pages/cart.ejs', { title: "Cart", user: req.user, "cart": [] })
    }
})

router.get('/checkout', checkAuthenticated, async (req, res) => {
    total_price = 0
    if (req.user.cart.length) {
        cart = req.user.cart

        for (var i = 0; i < cart.length; i++) {
            price = cart[i].price
            quantity = cart[i].count
            total_price += (price * quantity)
        }
    }
    res.render('pages/checkout', { title: "Checkout", user: req.user, total: total_price })
})

router.post('/checkout', checkAuthenticated, async (req, res) => {
    let { name, address_1, address_2, city, state, country, pin, cc } = ""
    name = req.body.name
    address_1 = req.body.address_1
    address_2 = req.body.address_2
    city = req.body.city
    state = req.body.state
    country = req.body.country
    pin = req.body.pin
    cc = req.body.cc
    order_id = makeid(20)
    //quantity removal
    let cart = req.user.cart
    for (var i = 0; i < cart.length; i++) {
        count = cart[i].count
        id = cart[i]._id
        let cart_new = cart[i]

        Product.findByIdAndUpdate(id, { $inc: { "quan": -count } }).then(async (result) => {
            await userCollection.where('id', '==', result.seller_id).get().then(async (result_fire) => {
                var result_fire = result_fire.docs[0].data()
                await userCollection.doc(result_fire.username).update({
                    retailer_orders: admin.firestore.FieldValue.arrayUnion(
                        {
                            name: name,
                            address: address_1 + ",\n" + address_2,
                            city: city,
                            state: state,
                            country: country,
                            pin: pin,
                            product_id: result.id,
                            product: cart_new,
                            count: count,
                            email: req.user.email,
                            order_id: order_id

                        })
                }).then((res_fire) => {
                    console.log("Seller Informed of the Order")
                })
            })
            console.log('Product quantity decreased')
        })
    }

    total_price = 0
    for (var i = 0; i < cart.length; i++) {
        price = cart[i].price
        quantity = cart[i].count
        total_price += (price * quantity)
    }

    res.render('pages/summary', { order_id: order_id, pin: pin, total: total_price, cart: cart, title: 'Order Summary', name: name, address_1: address_1, address_2: address_2, city: city, state: state, country: country, cc: cc })

    userCollection.doc(req.user.username).update({
        orders: admin.firestore.FieldValue.arrayUnion({ order_id: order_id, pin: pin, order: cart, total: total_price, name: name, address: address_1 + ',\n' + address_2, city: city, state: state, country: country, cc: cc })
    }).then((result) => {
        console.log('Order added In Consumer Orders')
        userCollection.doc(req.user.username).update({
            cart: []
        }).then((result) => {
            console.log('Cart Cleared')
        }).catch((err) => {
            console.log(err)
        })
    }).catch((err) => {
        console.log(err)
    })
})

router.get('/my_orders', checkAuthenticated, async (req, res) => {
    res.render('pages/my_orders', { title: "My Orders", user: req.user, products: req.user.orders })
})

router.get('/my_orders/:backlink', checkAuthenticated, async (req, res) => {
    let number = req.params.backlink
    if (number.length > 0 && !isNaN(number)) {
        let product = req.user.orders[number]
        console.log(typeof (product) != 'undefined' && product.hasOwnProperty('cc'))
        if (typeof (product) != 'undefined' && product.hasOwnProperty('cc')) {
            //res.send(req.body)
            res.render('pages/my_order_detailed', { title: "Detailed Order View", user: req.user, product: req.user.orders[number] })
        }
        else {
            res.render('pages/404', { title: "404 Not Found" })
        }
    }
    else {
        res.redirect('/my_orders')
    }
})

function makeid(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = router;